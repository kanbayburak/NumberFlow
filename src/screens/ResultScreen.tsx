import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  easyLevels,
  expertLevels,
  hardLevels,
  mediumLevels,
} from '../data/levels';
import type { RootStackParamList } from '../navigation/types';
import type { DifficultyType, Level } from '../types';
import { useGameStore } from '../store/gameStore';
import { useResolvedTheme } from '../store/settingsStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

function levelsForDifficulty(d: DifficultyType): Level[] {
  switch (d) {
    case 'easy':
      return easyLevels;
    case 'medium':
      return mediumLevels;
    case 'hard':
      return hardLevels;
    case 'expert':
      return expertLevels;
    default:
      return easyLevels;
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ResultScreen({ navigation, route }: Props) {
  const { levelId, stars, timeSeconds, moves, difficulty } = route.params;
  const theme = useResolvedTheme();
  const c = theme === 'dark' ? colors.dark : colors.light;

  const levels = levelsForDifficulty(difficulty);
  const idx = levels.findIndex(l => l.id === levelId);
  const nextLevel = idx >= 0 && idx < levels.length - 1 ? levels[idx + 1] : null;

  const setCurrentLevel = useGameStore(s => s.setCurrentLevel);
  const resetGame = useGameStore(s => s.resetGame);
  const resetTimer = useGameStore(s => s.resetTimer);
  const setGameStatus = useGameStore(s => s.setGameStatus);

  const startLevel = (level: Level) => {
    setCurrentLevel(level);
    resetGame();
    resetTimer();
    setGameStatus('idle');
    navigation.navigate('Game');
  };

  const onContinue = () => {
    if (nextLevel) {
      startLevel(nextLevel);
      return;
    }
    navigation.navigate('LevelSelection', { difficulty });
  };

  const onRetry = () => {
    const level = levels.find(l => l.id === levelId);
    if (!level) {
      navigation.goBack();
      return;
    }
    startLevel(level);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <Text style={[styles.heading, { color: c.text }]}>Seviye bitti</Text>
        <View style={[styles.starsBig, { borderColor: c.border }]}>
          {[1, 2, 3].map(s => (
            <Text
              key={s}
              style={[styles.starBig, { opacity: s <= stars ? 1 : 0.2 }]}>
              ★
            </Text>
          ))}
        </View>
        <View style={styles.stats}>
          <Text style={[styles.statLabel, { color: c.muted }]}>Yıldız</Text>
          <Text style={[styles.statValue, { color: c.text }]}>{stars} / 3</Text>
          <Text style={[styles.statLabel, { color: c.muted }]}>Süre</Text>
          <Text style={[styles.statValue, { color: c.text }]}>
            {formatTime(timeSeconds)}
          </Text>
          <Text style={[styles.statLabel, { color: c.muted }]}>Hamle</Text>
          <Text style={[styles.statValue, { color: c.text }]}>{moves}</Text>
        </View>
        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [
            styles.primaryBtn,
            { backgroundColor: c.primary, opacity: pressed ? 0.9 : 1 },
          ]}>
          <Text style={styles.primaryBtnText}>
            {nextLevel ? 'Devam' : 'Seviyelere dön'}
          </Text>
        </Pressable>
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.secondaryBtn,
            { borderColor: c.border, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Text style={[styles.secondaryBtnText, { color: c.text }]}>Tekrar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const colors = {
  light: {
    bg: '#f8fafc',
    text: '#0f172a',
    muted: '#64748b',
    primary: '#2563eb',
    border: '#e2e8f0',
  },
  dark: {
    bg: '#0f172a',
    text: '#f8fafc',
    muted: '#94a3b8',
    primary: '#3b82f6',
    border: '#334155',
  },
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  starsBig: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  starBig: {
    fontSize: 48,
    color: '#fbbf24',
  },
  stats: {
    gap: 8,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  primaryBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
