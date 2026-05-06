import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { AppSettings } from '../storage';
import { useResolvedTheme, useSettingsStore } from '../store/settingsStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const THEME_OPTIONS: { value: AppSettings['themePreference']; label: string }[] =
  [
    { value: 'light', label: 'Açık' },
    { value: 'dark', label: 'Koyu' },
    { value: 'system', label: 'Sistem' },
  ];

export function SettingsScreen({ navigation }: Props) {
  const theme = useResolvedTheme();
  const c = theme === 'dark' ? colors.dark : colors.light;

  const themePreference = useSettingsStore(s => s.themePreference);
  const soundEnabled = useSettingsStore(s => s.soundEnabled);
  const hapticsEnabled = useSettingsStore(s => s.hapticsEnabled);
  const setThemePreference = useSettingsStore(s => s.setThemePreference);
  const setSoundEnabled = useSettingsStore(s => s.setSoundEnabled);
  const setHapticsEnabled = useSettingsStore(s => s.setHapticsEnabled);
  const persist = useSettingsStore(s => s.persist);

  const commit = async (fn: () => void) => {
    fn();
    await persist();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={[styles.back, { color: c.primary }]}>‹ Geri</Text>
        </Pressable>
        <Text style={[styles.title, { color: c.text }]}>Ayarlar</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.muted }]}>Görünüm</Text>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {THEME_OPTIONS.map((opt, index) => {
            const selected = themePreference === opt.value;
            const isLast = index === THEME_OPTIONS.length - 1;
            return (
              <Pressable
                key={opt.value}
                onPress={() => void commit(() => setThemePreference(opt.value))}
                style={[
                  styles.themeRow,
                  {
                    borderBottomColor: c.border,
                    borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                  },
                ]}>
                <Text style={[styles.themeLabel, { color: c.text }]}>
                  {opt.label}
                </Text>
                {selected ? (
                  <Text style={[styles.check, { color: c.primary }]}>✓</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: c.muted }]}>Ses ve titreşim</Text>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <View
            style={[
              styles.row,
              { borderBottomColor: c.border, borderBottomWidth: StyleSheet.hairlineWidth },
            ]}>
            <Text style={[styles.rowLabel, { color: c.text }]}>Ses</Text>
            <Switch
              value={soundEnabled}
              onValueChange={v => void commit(() => setSoundEnabled(v))}
            />
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: c.text }]}>Titreşim</Text>
            <Switch
              value={hapticsEnabled}
              onValueChange={v => void commit(() => setHapticsEnabled(v))}
            />
          </View>
        </View>
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
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  check: {
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});
