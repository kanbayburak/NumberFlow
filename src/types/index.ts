export type DifficultyType = 'easy' | 'medium' | 'hard' | 'expert';

export interface Wall {
  row: number;
  col: number;
  edge: 'top' | 'right' | 'bottom' | 'left';
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface Level {
  id: string;
  title: string;
  difficulty: DifficultyType;
  gridSize: { rows: number; cols: number };
  numbers: (number | null)[][];
  walls: Wall[];
  solutionPath: CellPosition[];
  maxTimeFor3Stars: number;
  maxMovesFor3Stars: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'lost';

export interface GameState {
  currentLevel: Level | null;
  path: CellPosition[];
  moves: number;
  timer: number;
  gameStatus: GameStatus;
}

export interface PlayerProgress {
  completedLevelIds: string[];
  starsByLevelId: Record<string, number>;
  bestTimeByLevelId: Record<string, number>;
}
