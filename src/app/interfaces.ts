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

export enum SquareStates {
  EMPTY = 0,
  TREE = 1,
  VOID = 2,
}
