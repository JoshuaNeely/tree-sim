import {
  AlgorithmInput,
  AlgorithmOutput,
  Buffer,
  Coordinate,
  SquareState,
} from './util';


export function buildTreeData(
  input: AlgorithmInput,
  attemptNumber: number = 1,
): AlgorithmOutput {

  let remainingCoordinates: Coordinate[] = [];

  // mark every space as available
  for (let x=0; x<input.gridSize; x++) {
    for (let y=0; y<input.gridSize; y++) {
      const coordinateValue = input.initialCoordinates[x][y];
      if (!isPersistant(coordinateValue)) {
        remainingCoordinates.push( { x, y } );
      }
    }
  }

  // exclude with pre-existing trees
  for (let x=0; x<input.gridSize; x++) {
    for (let y=0; y<input.gridSize; y++) {
      const coordinateValue = input.initialCoordinates[x][y];
      if (coordinateValue === SquareState.PERSIST_TREE) {
        remainingCoordinates = excludeCoordinates(x,y, remainingCoordinates, input.buffer);
      }
    }
  }

  // attempt to pick desired number of spots
  // retry a certain number of times if you run out of spaces
  const pickedCoordinates = [];

  for (let i=0; i<input.numTrees; i++) {
    const remainingIndexs = remainingCoordinates.length;

    if (remainingIndexs > 0) {
      const selectionIndex = randomInt(0, remainingIndexs-1);
      const selection = remainingCoordinates[selectionIndex];
      pickedCoordinates.push(selection);

      remainingCoordinates = excludeCoordinates(
        selection.x,
        selection.y,
        remainingCoordinates,
        input.buffer,
      );
    }
    else {
      if (attemptNumber === input.maxAttempts) {
        return {
          treeData: coordinatesToGrid(input, pickedCoordinates),
          message: `Gave up after ${attemptNumber} attempts!
Only placed ${pickedCoordinates.length}!`,
        }
      }
      else {
        return buildTreeData(
          input,
          attemptNumber + 1
        );
      }
    }
  }

  return {
    treeData: coordinatesToGrid(input, pickedCoordinates),
    message: `succeeded after ${attemptNumber} attempts`,
  }
}

// apply rules to exclude remaining coordinates when one is selected 
function excludeCoordinates(pickX, pickY, availableCoordinates, buffer: Buffer): Coordinate[] {
  return availableCoordinates.filter(
    (coord: Coordinate) => {
      return !shouldExclude(pickX, pickY, coord, buffer);
    }
  );
}

// apply exclusion rules
function shouldExclude(pickX: number, pickY: number, coord: Coordinate, buffer: Buffer) {
  const startX = pickX - buffer.x;
  const startY = pickY - buffer.y;
  const endX = pickX + buffer.x;
  const endY = pickY + buffer.y;

  for (let x=startX; x<=endX; x++) {
    for (let y=startY; y<=endY; y++) {
      if (coord.x === x && coord.y === y) { return true; }
    }
  }
  return false;
}

function coordinatesToGrid(input: AlgorithmInput, coordinates: Coordinate[]): number[][] {
  const treeData = [];
  const gridSize = input.gridSize;

  // initialize empty
  for (let x=0; x<gridSize; x++) {
    treeData.push([]);
    for (let y=0; y<gridSize; y++) {
      const originalState = input.initialCoordinates[x][y];
      if (isPersistant(originalState)) {
        treeData[x][y] = originalState;
      } else {
        treeData[x][y] = SquareState.EMPTY;
      }
    }
  }

  // fill as needed
  for (const coord of coordinates) {
    treeData[coord.x][coord.y] = SquareState.TREE;
  }

  return treeData;
}

function isPersistant(state: SquareState): boolean {
  return state === SquareState.PERSIST_EMPTY || state === SquareState.PERSIST_TREE;
}

function randomInt(min, max){
  if (min > max) {
    throw new Error('ERROR: min is greater than max!');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
