import type { DifficultyType } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Difficulty: undefined;
  LevelSelection: { difficulty: DifficultyType };
  Game: undefined;
  Result: {
    levelId: string;
    stars: number;
    timeSeconds: number;
    moves: number;
    difficulty: DifficultyType;
  };
  Settings: undefined;
};
