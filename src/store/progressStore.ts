import { create } from 'zustand';
import type { PlayerProgress } from '../types';
import { loadPlayerProgress, savePlayerProgress } from '../storage';

type ProgressStore = PlayerProgress & {
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  markLevelCompleted: (levelId: string) => void;
  setLevelStars: (levelId: string, stars: number) => void;
  setBestTime: (levelId: string, timeSeconds: number) => void;
  setProgress: (progress: PlayerProgress) => void;
  resetProgress: () => void;
};

const emptyProgress: PlayerProgress = {
  completedLevelIds: [],
  starsByLevelId: {},
  bestTimeByLevelId: {},
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  ...emptyProgress,
  hydrate: async () => {
    const loaded = await loadPlayerProgress();
    if (loaded) {
      set({
        completedLevelIds: loaded.completedLevelIds,
        starsByLevelId: loaded.starsByLevelId,
        bestTimeByLevelId: loaded.bestTimeByLevelId,
      });
    }
  },
  persist: async () => {
    const { completedLevelIds, starsByLevelId, bestTimeByLevelId } = get();
    await savePlayerProgress({
      completedLevelIds,
      starsByLevelId,
      bestTimeByLevelId,
    });
  },
  markLevelCompleted: levelId =>
    set(state => ({
      completedLevelIds: state.completedLevelIds.includes(levelId)
        ? state.completedLevelIds
        : [...state.completedLevelIds, levelId],
    })),
  setLevelStars: (levelId, stars) =>
    set(state => ({
      starsByLevelId: {
        ...state.starsByLevelId,
        [levelId]: Math.max(stars, state.starsByLevelId[levelId] ?? 0),
      },
    })),
  setBestTime: (levelId, timeSeconds) =>
    set(state => {
      const prev = state.bestTimeByLevelId[levelId];
      const next =
        prev === undefined ? timeSeconds : Math.min(prev, timeSeconds);
      return {
        bestTimeByLevelId: {
          ...state.bestTimeByLevelId,
          [levelId]: next,
        },
      };
    }),
  setProgress: progress =>
    set({
      completedLevelIds: progress.completedLevelIds,
      starsByLevelId: progress.starsByLevelId,
      bestTimeByLevelId: progress.bestTimeByLevelId,
    }),
  resetProgress: () => set({ ...emptyProgress }),
}));
