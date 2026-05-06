import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { CellPosition, Level } from '../../types';
import {
  isLevelComplete,
  sameCell,
  tryExtendPath,
} from '../../game/gameEngine';
import { useGameStore } from '../../store/gameStore';
import { GridCell } from './GridCell';

type Props = {
  level: Level;
};

function cellWalls(level: Level, row: number, col: number) {
  const hit = (edge: 'top' | 'right' | 'bottom' | 'left') =>
    level.walls.some(w => w.row === row && w.col === col && w.edge === edge);
  return {
    wallTop: hit('top'),
    wallRight: hit('right'),
    wallBottom: hit('bottom'),
    wallLeft: hit('left'),
  };
}

export function GridBoard({ level }: Props) {
  const path = useGameStore(s => s.path);
  const setPath = useGameStore(s => s.setPath);
  const incrementMoves = useGameStore(s => s.incrementMoves);
  const setMoves = useGameStore(s => s.setMoves);
  const setGameStatus = useGameStore(s => s.setGameStatus);

  const layoutRef = useRef({ width: 1, height: 1 });
  const lastEmittedCell = useRef<CellPosition | null>(null);

  const pathKeys = useMemo(() => {
    const set = new Set<string>();
    for (const p of path) {
      set.add(`${p.row},${p.col}`);
    }
    return set;
  }, [path]);

  const onCell = useCallback(
    (cell: CellPosition | null) => {
      if (!cell) {
        return;
      }
      if (
        lastEmittedCell.current &&
        sameCell(lastEmittedCell.current, cell)
      ) {
        return;
      }
      lastEmittedCell.current = cell;

      const prevPath = useGameStore.getState().path;
      const result = tryExtendPath(level, prevPath, cell);
      if (!result.ok) {
        return;
      }

      const lengthened = result.path.length > prevPath.length;
      const shortened = result.path.length < prevPath.length;

      setPath(result.path);
      if (lengthened) {
        incrementMoves();
      } else if (shortened) {
        const m = useGameStore.getState().moves;
        setMoves(Math.max(0, m - 1));
      }

      if (isLevelComplete(level, result.path)) {
        setGameStatus('won');
      }
    },
    [incrementMoves, level, setGameStatus, setMoves, setPath],
  );

  const toCell = useCallback(
    (x: number, y: number): CellPosition | null => {
      const { width, height } = layoutRef.current;
      if (width <= 0 || height <= 0) {
        return null;
      }
      const cols = level.gridSize.cols;
      const rows = level.gridSize.rows;
      const col = Math.floor((x / width) * cols);
      const row = Math.floor((y / height) * rows);
      if (row < 0 || col < 0 || row >= rows || col >= cols) {
        return null;
      }
      return { row, col };
    },
    [level.gridSize.cols, level.gridSize.rows],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(e => {
          lastEmittedCell.current = null;
          onCell(toCell(e.x, e.y));
        })
        .onUpdate(e => {
          onCell(toCell(e.x, e.y));
        })
        .onFinalize(() => {
          lastEmittedCell.current = null;
        }),
    [onCell, toCell],
  );

  const rows = level.gridSize.rows;
  const cols = level.gridSize.cols;

  return (
    <GestureDetector gesture={pan}>
      <View
        style={[styles.board, { aspectRatio: cols / rows }]}
        onLayout={e => {
          const { width, height } = e.nativeEvent.layout;
          layoutRef.current = { width, height };
        }}>
        {Array.from({ length: rows }).map((_, r) => (
          <View key={r} style={styles.row}>
            {Array.from({ length: cols }).map((__, c) => {
              const walls = cellWalls(level, r, c);
              const value = level.numbers[r][c];
              return (
                <View key={`${r}-${c}`} style={styles.cellWrap}>
                  <GridCell
                    value={value}
                    wallTop={walls.wallTop}
                    wallRight={walls.wallRight}
                    wallBottom={walls.wallBottom}
                    wallLeft={walls.wallLeft}
                    isOnPath={pathKeys.has(`${r},${c}`)}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    maxHeight: '100%',
    alignSelf: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cellWrap: {
    flex: 1,
  },
});
