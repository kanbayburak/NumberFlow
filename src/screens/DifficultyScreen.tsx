import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { DifficultyType } from '../types';
import { useResolvedTheme } from '../store/settingsStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Difficulty'>;

const OPTIONS: { key: DifficultyType; label: string }[] = [
  { key: 'easy', label: 'Kolay' },
  { key: 'medium', label: 'Orta' },
  { key: 'hard', label: 'Zor' },
  { key: 'expert', label: 'Uzman' },
];

export function DifficultyScreen({ navigation }: Props) {
  const theme = useResolvedTheme();
  const c = theme === 'dark' ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={[styles.back, { color: c.primary }]}>‹ Geri</Text>
        </Pressable>
        <Text style={[styles.title, { color: c.text }]}>Zorluk</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.list}>
        {OPTIONS.map(opt => (
          <Pressable
            key={opt.key}
            onPress={() =>
              navigation.navigate('LevelSelection', { difficulty: opt.key })
            }
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: c.card,
                borderColor: c.border,
                opacity: pressed ? 0.92 : 1,
              },
            ]}>
            <Text style={[styles.rowLabel, { color: c.text }]}>{opt.label}</Text>
            <Text style={[styles.chev, { color: c.muted }]}>›</Text>
          </Pressable>
        ))}
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
    card: '#ffffff',
  },
  dark: {
    bg: '#0f172a',
    text: '#f8fafc',
    muted: '#94a3b8',
    primary: '#60a5fa',
    border: '#334155',
    card: '#1e293b',
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
  list: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
  },
  rowLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  chev: {
    fontSize: 22,
    fontWeight: '300',
  },
});
