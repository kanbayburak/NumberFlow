import { create } from 'zustand';
import type { CellPosition, GameStatus, Level } from '../types';

type GameStore = {
  currentLevel: Level | null;
  path: CellPosition[];
  moves: number;
  timer: number;
  gameStatus: GameStatus;
  setCurrentLevel: (level: Level | null) => void;
  setPath: (path: CellPosition[]) => void;
  appendToPath: (cell: CellPosition) => void;
  popPath: () => void;
  clearPath: () => void;
  setMoves: (moves: number) => void;
  incrementMoves: () => void;
  setTimer: (seconds: number) => void;
  tickTimer: () => void;
  resetTimer: () => void;
  setGameStatus: (status: GameStatus) => void;
  resetGame: () => void;
};

const initial = {
  currentLevel: null as Level | null,
  path: [] as CellPosition[],
  moves: 0,
  timer: 0,
  gameStatus: 'idle' as GameStatus,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initial,
  setCurrentLevel: level => set({ currentLevel: level }),
  setPath: path => set({ path }),
  appendToPath: cell =>
    set(state => ({ path: [...state.path, cell] })),
  popPath: () =>
    set(state => ({ path: state.path.slice(0, -1) })),
  clearPath: () => set({ path: [] }),
  setMoves: moves => set({ moves }),
  incrementMoves: () => set(state => ({ moves: state.moves + 1 })),
  setTimer: timer => set({ timer }),
  tickTimer: () => set(state => ({ timer: state.timer + 1 })),
  resetTimer: () => set({ timer: 0 }),
  setGameStatus: gameStatus => set({ gameStatus }),
  resetGame: () =>
    set({
      ...initial,
      currentLevel: get().currentLevel,
    }),
}));
