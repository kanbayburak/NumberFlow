import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useResolvedTheme } from '../store/settingsStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const theme = useResolvedTheme();
  const c = theme === 'dark' ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <Text style={[styles.headline, { color: c.text }]}>NumberFlow</Text>
        <Text style={[styles.tagline, { color: c.muted }]}>
          Sayıları sırayla birleştir, labirenti çöz.
        </Text>
        <Pressable
          onPress={() => navigation.navigate('Difficulty')}
          style={({ pressed }) => [
            styles.primaryBtn,
            { backgroundColor: c.primary, opacity: pressed ? 0.9 : 1 },
          ]}>
          <Text style={styles.primaryBtnText}>Oyna</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          style={({ pressed }) => [
            styles.secondaryBtn,
            {
              borderColor: c.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}>
          <Text style={[styles.secondaryBtnText, { color: c.text }]}>Ayarlar</Text>
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
    border: '#cbd5e1',
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
    justifyContent: 'center',
    gap: 16,
  },
  headline: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  primaryBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 18,
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
