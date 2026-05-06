import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import type { AppSettings } from '../storage';
import { loadSettings, saveSettings } from '../storage';

type SettingsStore = AppSettings & {
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  setThemePreference: (v: AppSettings['themePreference']) => void;
  setSoundEnabled: (v: boolean) => void;
  setHapticsEnabled: (v: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  themePreference: 'system',
  soundEnabled: true,
  hapticsEnabled: true,
  hydrate: async () => {
    const s = await loadSettings();
    set({
      themePreference: s.themePreference,
      soundEnabled: s.soundEnabled,
      hapticsEnabled: s.hapticsEnabled,
    });
  },
  persist: async () => {
    const { themePreference, soundEnabled, hapticsEnabled } = get();
    await saveSettings({ themePreference, soundEnabled, hapticsEnabled });
  },
  setThemePreference: themePreference => set({ themePreference }),
  setSoundEnabled: soundEnabled => set({ soundEnabled }),
  setHapticsEnabled: hapticsEnabled => set({ hapticsEnabled }),
}));

export function useResolvedTheme(): 'light' | 'dark' {
  const pref = useSettingsStore(s => s.themePreference);
  const system = useColorScheme();
  if (pref === 'system') {
    return system === 'dark' ? 'dark' : 'light';
  }
  return pref;
}
