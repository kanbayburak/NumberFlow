import { useEffect, useRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GridBoard } from '../components/Grid/GridBoard';
import { easyLevels } from '../data/levels/easy';
import type { RootStackParamList } from '../navigation/types';
import type { Level } from '../types';
import { useGameStore } from '../store/gameStore';
import { useProgressStore } from '../store/progressStore';

function starsForResult(level: Level, time: number, moves: number): number {
  if (
    time <= level.maxTimeFor3Stars &&
    moves <= level.maxMovesFor3Stars
  ) {
    return 3;
  }
  if (
    time <= level.maxTimeFor3Stars ||
    moves <= level.maxMovesFor3Stars
  ) {
    return 2;
  }
  return 1;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function GameScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const sentResultRef = useRef(false);
  const currentLevel = useGameStore(s => s.currentLevel);
  const timer = useGameStore(s => s.timer);
  const moves = useGameStore(s => s.moves);
  const gameStatus = useGameStore(s => s.gameStatus);
  const tickTimer = useGameStore(s => s.tickTimer);
  const resetTimer = useGameStore(s => s.resetTimer);
  const resetGame = useGameStore(s => s.resetGame);
  const setGameStatus = useGameStore(s => s.setGameStatus);
  const setCurrentLevel = useGameStore(s => s.setCurrentLevel);

  const level = currentLevel ?? easyLevels[0];

  useEffect(() => {
    if (!currentLevel) {
      setCurrentLevel(easyLevels[0]);
    }
  }, [currentLevel, setCurrentLevel]);

  useEffect(() => {
    resetTimer();
    setGameStatus('playing');
  }, [level.id, resetTimer, setGameStatus]);

  useEffect(() => {
    if (gameStatus !== 'playing') {
      return;
    }
    const id = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(id);
  }, [gameStatus, tickTimer]);

  useEffect(() => {
    if (gameStatus !== 'won') {
      sentResultRef.current = false;
      return;
    }
    if (sentResultRef.current) {
      return;
    }
    sentResultRef.current = true;
    const stars = starsForResult(level, timer, moves);
    const ps = useProgressStore.getState();
    ps.markLevelCompleted(level.id);
    ps.setLevelStars(level.id, stars);
    ps.setBestTime(level.id, timer);
    void ps.persist();
    navigation.navigate('Result', {
      levelId: level.id,
      stars,
      timeSeconds: timer,
      moves,
      difficulty: level.difficulty,
    });
  }, [gameStatus, level, timer, moves, navigation]);

  const onReset = () => {
    resetGame();
    setGameStatus('playing');
    resetTimer();
  };

  const onUndo = () => {
    const st = useGameStore.getState();
    if (st.path.length === 0) {
      return;
    }
    st.popPath();
    st.setMoves(Math.max(0, st.moves - 1));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.toolbar}>
        <Text style={styles.timerLabel}>{formatTime(timer)}</Text>
        <View style={styles.toolbarActions}>
          <Pressable
            onPress={onReset}
            style={({ pressed }) => [
              styles.btn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.btnLabel}>Sıfırla</Text>
          </Pressable>
          <Pressable
            onPress={onUndo}
            style={({ pressed }) => [
              styles.btn,
              pressed && styles.btnPressed,
            ]}>
            <Text style={styles.btnLabel}>Geri al</Text>
          </Pressable>
          <Pressable disabled style={[styles.btn, styles.btnDisabled]}>
            <Text style={styles.btnLabelMuted}>İpucu</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.meta}>
        Hamle: {moves}
        {gameStatus === 'won' ? ' · Tamamlandı' : ''}
      </Text>
      <View style={styles.gridWrap}>
        <GridBoard level={level} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  toolbarActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timerLabel: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0f172a',
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#2563eb',
    borderRadius: 10,
  },
  btnPressed: {
    opacity: 0.85,
  },
  btnDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.7,
  },
  btnLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  btnLabelMuted: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  meta: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: '#475569',
    fontSize: 14,
  },
  gridWrap: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 12,
    minHeight: 200,
  },
});
