import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { useProgressStore } from '../store/progressStore';
import { useResolvedTheme } from '../store/settingsStore';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelection'>;

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

function isLevelUnlocked(
  levels: Level[],
  index: number,
  completedIds: string[],
): boolean {
  if (index === 0) {
    return true;
  }
  const prevId = levels[index - 1].id;
  return completedIds.includes(prevId);
}

export function LevelSelectionScreen({ navigation, route }: Props) {
  const { difficulty } = route.params;
  const theme = useResolvedTheme();
  const c = theme === 'dark' ? colors.dark : colors.light;
  const completedLevelIds = useProgressStore(s => s.completedLevelIds);
  const starsByLevelId = useProgressStore(s => s.starsByLevelId);

  const levels = levelsForDifficulty(difficulty);
  const setCurrentLevel = useGameStore(s => s.setCurrentLevel);
  const resetGame = useGameStore(s => s.resetGame);
  const resetTimer = useGameStore(s => s.resetTimer);
  const setGameStatus = useGameStore(s => s.setGameStatus);

  const openLevel = (level: Level) => {
    setCurrentLevel(level);
    resetGame();
    resetTimer();
    setGameStatus('idle');
    navigation.navigate('Game');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={[styles.back, { color: c.primary }]}>‹ Geri</Text>
        </Pressable>
        <Text style={[styles.title, { color: c.text }]}>Seviyeler</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.grid}>
        {levels.map((level, index) => {
          const unlocked = isLevelUnlocked(levels, index, completedLevelIds);
          const stars = starsByLevelId[level.id] ?? 0;
          return (
            <Pressable
              key={level.id}
              disabled={!unlocked}
              onPress={() => openLevel(level)}
              style={({ pressed }) => [
                styles.tile,
                {
                  backgroundColor: unlocked ? c.card : c.lockedBg,
                  borderColor: c.border,
                  opacity: !unlocked ? 0.65 : pressed ? 0.9 : 1,
                },
              ]}>
              <Text style={[styles.tileNum, { color: c.text }]}>
                {index + 1}
              </Text>
              <Text
                style={[styles.tileTitle, { color: c.muted }]}
                numberOfLines={1}>
                {level.title}
              </Text>
              {!unlocked ? (
                <Text style={styles.lock}>🔒</Text>
              ) : (
                <View style={styles.starsRow}>
                  {[1, 2, 3].map(s => (
                    <Text
                      key={s}
                      style={[
                        styles.star,
                        { opacity: s <= stars ? 1 : 0.25 },
                      ]}>
                      ★
                    </Text>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
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
    card: '#ffffff',
    lockedBg: '#e2e8f0',
  },
  dark: {
    bg: '#0f172a',
    text: '#f8fafc',
    muted: '#94a3b8',
    primary: '#60a5fa',
    border: '#334155',
    card: '#1e293b',
    lockedBg: '#1e293b',
  },
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  back: {
    fontSize: 17,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 56,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
    justifyContent: 'center',
  },
  tile: {
    width: '44%',
    maxWidth: 200,
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'center',
  },
  tileNum: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  tileTitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    fontSize: 18,
    color: '#fbbf24',
  },
  lock: {
    fontSize: 20,
    marginTop: 4,
  },
});
