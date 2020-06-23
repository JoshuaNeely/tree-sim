interface Coordinate {
  x: number;
  y: number;
}

// the space required around every selection
interface Buffer {
  x: number;
  y: number;
}

export function buildTreeData(gridSize: number, buffer: Buffer, numTrees: number): number[][] {
  const availableCoordinates: Coordinate[] = [];

  // mark every space as available
  for (let x=0; x<gridSize; x++) {
    for (let y=0; y<gridSize; y++) {
      availableCoordinates.push(
        { x, y }
      );
    }
  }

  // attempt to pick desired number of spots
  // retry a certain number of times if you run out of spaces
  const pickedCoordinates = [];

  const selection = { x: 8, y: 4 };
  pickedCoordinates.push(selection);

  const remainingCoordinates = excludeCoordinates(selection.x, selection.y, availableCoordinates, buffer);
  
  return coordinatesToGrid(gridSize, remainingCoordinates);
  // return coordinatesToGrid(gridSize, pickedCordinates);
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
