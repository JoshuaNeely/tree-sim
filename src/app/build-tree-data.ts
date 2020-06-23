import { AlgorithmInput, Coordinate, Buffer, AlgorithmOutput } from './interfaces';

export function buildTreeData(
  input: AlgorithmInput,
  attemptNumber: number = 1,
): AlgorithmOutput {

  let remainingCoordinates: Coordinate[] = [];

  // mark every space as available
  for (let x=0; x<input.gridSize; x++) {
    for (let y=0; y<input.gridSize; y++) {
      remainingCoordinates.push(
        { x, y }
      );
    }
  }

  // attempt to pick desired number of spots
  // retry a certain number of times if you run out of spaces
  const pickedCoordinates = [];

  for (let i=0; i<input.numTrees; i++) {
    const remainingIndexs = remainingCoordinates.length-1;
    if (remainingIndexs > 0) {
      const selectionIndex = randomInt(0, remainingIndexs);
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
          treeData: coordinatesToGrid(input.gridSize, pickedCoordinates),
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
    treeData: coordinatesToGrid(input.gridSize, pickedCoordinates),
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

function coordinatesToGrid(gridSize: number, coordinates: Coordinate[]): number[][] {
  const treeData = [];

  for (let x=0; x<gridSize; x++) {
    treeData.push([]);
  }

  for (const coord of coordinates) {
    treeData[coord.x][coord.y] = 1;
  }

  return treeData;
}

function randomInt(min, max){
 return Math.floor(Math.random() * (max - min + 1)) + min;
}
