export interface Coordinate {
  x: number;
  y: number;
}

// the space required around every selection
export interface Buffer {
  x: number;
  y: number;
}

export interface AlgorithmInput {
  gridSize: number;
  buffer: Buffer;
  numTrees: number;
  maxAttempts: number;
  initialCoordinates: number[][];
}

export interface AlgorithmOutput {
  treeData: number[][];
  message: string;
}

export enum SquareState {
  EMPTY = 0,
  TREE = 1,
  PERSIST_EMPTY = 2,
  PERSIST_TREE = 3,
}

export const AllSquareStates = [
  0, 1, 2, 3,
];

export function getStateColor(state: SquareState): string {
  switch (state) {
    case SquareState.EMPTY:
      return 'white';

    case SquareState.TREE:
      return 'black';

    case SquareState.PERSIST_EMPTY:
      return 'red';

    case SquareState.PERSIST_TREE:
      return 'blue';

    default:
      throw new Error('ERROR: Unexpected state');
  }
}

export function getStateDescription(state: SquareState): string {
  switch (state) {
    case SquareState.EMPTY:
      return 'Empty space';

    case SquareState.TREE:
      return 'Tree (excludes)';

    case SquareState.PERSIST_EMPTY:
      return 'Perminant empty space';

    case SquareState.PERSIST_TREE:
      return 'Perminant tree (excludes)';

    default:
      throw new Error('ERROR: Unexpected state');
  }
}
