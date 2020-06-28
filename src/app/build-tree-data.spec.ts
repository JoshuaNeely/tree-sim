import { buildTreeData } from './build-tree-data';
import {
  AlgorithmInput,
  AlgorithmOutput,
  Buffer,
  Coordinate,
  SquareState,
  AllSquareStates,
  getStateColor,
  getStateDescription,
  createGrid,
} from './util';


describe('buildTreeData', () => {
  it('should preserve persistant squares', () => {
    const grid = createGrid(SquareState.EMPTY, 3);

    grid[0][0] = SquareState.PERSIST_TREE;

    const input: AlgorithmInput = {
      gridSize: 3,
      buffer: {x: 0, y: 0},
      numTrees: 1,
      maxAttempts: 1,
      initialCoordinates: grid,
    };

    const output: AlgorithmOutput = buildTreeData(input);

    expect(output.treeData[0][0]).toBe(SquareState.PERSIST_TREE);
  });
});
