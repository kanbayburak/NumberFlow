import type { CellPosition, Level } from '../types';

function posKey(p: CellPosition): string {
  return `${p.row},${p.col}`;
}

export function sameCell(a: CellPosition, b: CellPosition): boolean {
  return a.row === b.row && a.col === b.col;
}

export function areAdjacent(a: CellPosition, b: CellPosition): boolean {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return dr + dc === 1;
}

export function isInside(level: Level, p: CellPosition): boolean {
  return (
    p.row >= 0 &&
    p.col >= 0 &&
    p.row < level.gridSize.rows &&
    p.col < level.gridSize.cols
  );
}

function wallKey(row: number, col: number, edge: string): string {
  return `${row},${col},${edge}`;
}

function buildWallSet(level: Level): Set<string> {
  const s = new Set<string>();
  for (const w of level.walls) {
    s.add(wallKey(w.row, w.col, w.edge));
  }
  return s;
}

export function hasWallBetween(
  level: Level,
  a: CellPosition,
  b: CellPosition,
): boolean {
  if (!areAdjacent(a, b)) {
    return true;
  }
  const walls = buildWallSet(level);
  const dr = b.row - a.row;
  const dc = b.col - a.col;
  if (dr === 1) {
    return (
      walls.has(wallKey(a.row, a.col, 'bottom')) ||
      walls.has(wallKey(b.row, b.col, 'top'))
    );
  }
  if (dr === -1) {
    return (
      walls.has(wallKey(a.row, a.col, 'top')) ||
      walls.has(wallKey(b.row, b.col, 'bottom'))
    );
  }
  if (dc === 1) {
    return (
      walls.has(wallKey(a.row, a.col, 'right')) ||
      walls.has(wallKey(b.row, b.col, 'left'))
    );
  }
  if (dc === -1) {
    return (
      walls.has(wallKey(a.row, a.col, 'left')) ||
      walls.has(wallKey(b.row, b.col, 'right'))
    );
  }
  return true;
}

export function getMaxNumber(level: Level): number {
  let m = 0;
  for (const row of level.numbers) {
    for (const v of row) {
      if (v !== null && v > m) {
        m = v;
      }
    }
  }
  return m;
}

export function findCellWithNumber(
  level: Level,
  n: number,
): CellPosition | null {
  for (let r = 0; r < level.gridSize.rows; r++) {
    for (let c = 0; c < level.gridSize.cols; c++) {
      if (level.numbers[r][c] === n) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

/** Geçerli yol üzerinde sıradaki beklenen numara (1 tabanlı zincir). */
export function getSequenceProgress(
  level: Level,
  path: CellPosition[],
): { valid: boolean; nextExpected: number } {
  let expected = 1;
  const maxN = getMaxNumber(level);
  for (const p of path) {
    const v = level.numbers[p.row][p.col];
    if (v === null) {
      continue;
    }
    if (v !== expected) {
      return { valid: false, nextExpected: expected };
    }
    expected++;
    if (expected > maxN + 1) {
      return { valid: false, nextExpected: expected };
    }
  }
  return { valid: true, nextExpected: expected };
}

export function isNumberSequenceValid(
  level: Level,
  path: CellPosition[],
): boolean {
  return getSequenceProgress(level, path).valid;
}

export function isLevelComplete(level: Level, path: CellPosition[]): boolean {
  if (path.length === 0) {
    return false;
  }
  const maxN = getMaxNumber(level);
  const { valid, nextExpected } = getSequenceProgress(level, path);
  if (!valid || nextExpected !== maxN + 1) {
    return false;
  }
  const last = path[path.length - 1];
  return level.numbers[last.row][last.col] === maxN;
}

export type ExtendPathResult =
  | { ok: true; path: CellPosition[] }
  | { ok: false; reason: string };

/**
 * Yeni hücre eklemeyi veya geri iz sürmeyi dener; duvar, komşuluk,
 * tekrar ziyaret ve sayı sırası kurallarını uygular.
 */
export function tryExtendPath(
  level: Level,
  path: CellPosition[],
  next: CellPosition,
): ExtendPathResult {
  if (!isInside(level, next)) {
    return { ok: false, reason: 'out_of_bounds' };
  }

  if (path.length === 0) {
    const start = level.numbers[next.row][next.col];
    if (start !== 1) {
      return { ok: false, reason: 'must_start_at_one' };
    }
    const newPath = [next];
    if (!isNumberSequenceValid(level, newPath)) {
      return { ok: false, reason: 'invalid_sequence' };
    }
    return { ok: true, path: newPath };
  }

  if (path.length >= 2 && sameCell(next, path[path.length - 2])) {
    const shortened = path.slice(0, -1);
    if (!isNumberSequenceValid(level, shortened)) {
      return { ok: false, reason: 'invalid_sequence' };
    }
    return { ok: true, path: shortened };
  }

  const last = path[path.length - 1];
  if (sameCell(next, last)) {
    return { ok: false, reason: 'same_cell' };
  }

  if (!areAdjacent(last, next)) {
    return { ok: false, reason: 'not_adjacent' };
  }

  if (hasWallBetween(level, last, next)) {
    return { ok: false, reason: 'wall' };
  }

  const past = path.slice(0, -1);
  if (past.some(p => sameCell(p, next))) {
    return { ok: false, reason: 'already_visited' };
  }

  const newPath = [...path, next];
  if (!isNumberSequenceValid(level, newPath)) {
    return { ok: false, reason: 'invalid_sequence' };
  }

  return { ok: true, path: newPath };
}

/** Mevcut path için tam kurallı doğrulama (yeniden çizim sonrası). */
export function validateFullPath(
  level: Level,
  path: CellPosition[],
): boolean {
  if (path.length === 0) {
    return true;
  }
  const keys = new Set<string>();
  for (const p of path) {
    if (!isInside(level, p)) {
      return false;
    }
    const k = posKey(p);
    if (keys.has(k)) {
      return false;
    }
    keys.add(k);
  }
  if (level.numbers[path[0].row][path[0].col] !== 1) {
    return false;
  }
  for (let i = 1; i < path.length; i++) {
    if (!areAdjacent(path[i - 1], path[i])) {
      return false;
    }
    if (hasWallBetween(level, path[i - 1], path[i])) {
      return false;
    }
  }
  return isNumberSequenceValid(level, path);
}
