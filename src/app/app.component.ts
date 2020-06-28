import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { buildTreeData } from './build-tree-data';
import packagejson from '../../package.json';
import {
  AlgorithmInput,
  AlgorithmOutput,
  Buffer,
  Coordinate,
  SquareState,
  AllSquareStates,
  getStateColor,
  getStateDescription,
  Grid,
} from './util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  numberOfTrees: number = 10;
  bufferX: number = 2;
  bufferY: number = 2;
  gridSizeSquares: number = 16;
  maxAttempts: number = 10;

  canvasWidth: number;
  canvasHeight: number;

  legend = AllSquareStates.map(state => {
    return { 
      color: getStateColor(state),
      description: getStateDescription(state),
    }
  });

  // read from package.json
  version: string = '0.0.0';

  // feedback to the user on the algorithm
  message: string = '';

  squaresData: Grid = [];

  private ctx: CanvasRenderingContext2D;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  


  constructor(private title: Title) {}
  

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.canvasWidth = this.ctx.canvas.width;
    this.canvasHeight= this.ctx.canvas.width;

    this.setTitle();

    this.initializeSquaresData();
    this.regenerate();
  }

  private initializeSquaresData(): void {
    for (let x=0; x<this.gridSizeSquares; x++) {
      this.squaresData.push([]);

      for (let y=0; y<this.gridSizeSquares; y++) {
        this.squaresData[x][y] = SquareState.EMPTY;
      }
    }
  }

  private setTitle(): void {
    this.version = packagejson.version;
    const currentTitle = this.title.getTitle();
    this.title.setTitle(`${currentTitle} ${this.version}`);
  }

  regenerate(): void {
    this.clearCanvas();
    const algorithmOutput = this.buildTreeData();
    this.squaresData = algorithmOutput.treeData;
    this.message = algorithmOutput.message;
    this.drawSquares();
  }

  handleCanvasClick(event: MouseEvent) {
    const canvas = event.target as HTMLElement;
    const canvasRelativeX = event.x - canvas.offsetLeft;
    const canvasRelativeY = event.y - canvas.offsetTop;

    const squareWidth= this.canvasWidth / this.gridSizeSquares;
    const squareHeight = this.canvasWidth / this.gridSizeSquares;

    const squareXIndex = Math.floor(canvasRelativeX / squareWidth);
    const squareYIndex = Math.floor(canvasRelativeY / squareHeight);

    this.cycleSquareState(squareXIndex, squareYIndex);
  }

  private cycleSquareState(x, y) {
    switch(this.squaresData[x][y]) {
      case SquareState.EMPTY:
        this.squaresData[x][y] = SquareState.PERSIST_EMPTY;
        break;

      case SquareState.PERSIST_EMPTY:
        this.squaresData[x][y] = SquareState.PERSIST_TREE;
        break;

      case SquareState.PERSIST_TREE:
        this.squaresData[x][y] = SquareState.EMPTY;
        break;

      default:
        throw new Error('ERROR: Unexpected state');
    }

    this.drawSquares();
  }

  private buildTreeData(): AlgorithmOutput {
    return buildTreeData({
      gridSize: this.gridSizeSquares,
      buffer: {x: this.bufferX, y: this.bufferY},
      numTrees: this.numberOfTrees,
      maxAttempts: this.maxAttempts,
      initialCoordinates: this.squaresData,
    });
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0,0, this.canvasWidth, this.canvasHeight);
  }

  private drawSquare(x: number, y: number, width: number, height: number, state: number) {
    this.ctx.fillStyle = getStateColor(state);

    switch (state) {
      case SquareState.TREE:
        this.ctx.fillRect(x, y, width, height);
        break;

      case SquareState.PERSIST_EMPTY:
        this.ctx.fillRect(x, y, width, height);
        break;

      case SquareState.PERSIST_TREE:
        this.ctx.fillRect(x, y, width, height);
        break;

      case SquareState.EMPTY:
        this.ctx.fillRect(x, y, width, height);
        break;

      default:
        throw new Error('ERROR: Unexpected state');
    }

    this.ctx.strokeRect(x, y, width, height);
  }

  private drawSquares() {
    const squareWidth= this.canvasWidth / this.gridSizeSquares;
    const squareHeight = this.canvasWidth / this.gridSizeSquares;

    for (let x=0; x<this.gridSizeSquares; x++) {
      for (let y=0; y<this.gridSizeSquares; y++) {
        this.drawSquare(
          x*squareWidth,
          y*squareHeight,
          squareWidth,
          squareHeight,
          this.squaresData[x][y],
        );
      }
    }
  }
}
