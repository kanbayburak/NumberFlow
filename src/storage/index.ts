import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PlayerProgress } from '../types';

const PROGRESS_KEY = '@numberflow/player-progress';
const SETTINGS_KEY = '@numberflow/settings';

export type AppSettings = {
  themePreference: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
};

const defaultSettings: AppSettings = {
  themePreference: 'system',
  soundEnabled: true,
  hapticsEnabled: true,
};

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (raw == null) {
    return defaultSettings;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      ...defaultSettings,
      ...parsed,
      themePreference:
        parsed.themePreference === 'light' ||
        parsed.themePreference === 'dark' ||
        parsed.themePreference === 'system'
          ? parsed.themePreference
          : defaultSettings.themePreference,
      soundEnabled:
        typeof parsed.soundEnabled === 'boolean'
          ? parsed.soundEnabled
          : defaultSettings.soundEnabled,
      hapticsEnabled:
        typeof parsed.hapticsEnabled === 'boolean'
          ? parsed.hapticsEnabled
          : defaultSettings.hapticsEnabled,
    };
  } catch {
    return defaultSettings;
  }
}

export async function savePlayerProgress(
  progress: PlayerProgress,
): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export async function loadPlayerProgress(): Promise<PlayerProgress | null> {
  const raw = await AsyncStorage.getItem(PROGRESS_KEY);
  if (raw == null) {
    return null;
  }
  try {
    return JSON.parse(raw) as PlayerProgress;
  } catch {
    return null;
  }
}
