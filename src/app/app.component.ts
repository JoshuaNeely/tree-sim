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
  SquareStates,
} from './interfaces';


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

  // read from package.json
  version: string = '0.0.0';

  // feedback to the user on the algorithm
  message: string = '';

  squaresData: number[][] = [];

  private ctx: CanvasRenderingContext2D;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  


  constructor(private title: Title) {}
  

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.canvasWidth = this.ctx.canvas.width;
    this.canvasHeight= this.ctx.canvas.width;

    this.setVersion();

    this.redraw();
  }

  private setVersion(): void {
    this.version = packagejson.version;
    const currentTitle = this.title.getTitle();
    this.title.setTitle(`${currentTitle} ${this.version}`);
  }

  redraw(): void {
    this.clearCanvas();
    const algorithmOutput = this.buildTreeData();
    this.drawSquares(algorithmOutput.treeData);
    this.message = algorithmOutput.message;
  }

  handleCanvasClick(event: MouseEvent) {
    const canvas = event.target as HTMLElement;
    const canvasRelativeX = event.x - canvas.offsetLeft;
    const canvasRelativeY = event.y - canvas.offsetTop;

    const squareWidth= this.canvasWidth / this.gridSizeSquares;
    const squareHeight = this.canvasWidth / this.gridSizeSquares;

    // which square did I click on?
    const squareXIndex = Math.floor(canvasRelativeX / squareWidth);
    const squareYIndex = Math.floor(canvasRelativeY / squareHeight);

    console.log(squareXIndex, squareYIndex);
  }

  private buildTreeData(): AlgorithmOutput {
    return buildTreeData({
      gridSize: this.gridSizeSquares,
      buffer: {x: this.bufferX, y: this.bufferY},
      numTrees: this.numberOfTrees,
      maxAttempts: this.maxAttempts,
      voidedCoordinates: [],
    });
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0,0, this.canvasWidth, this.canvasHeight);
  }

  private drawSquare(x: number, y: number, width: number, height: number, state: number) {
    switch (state) {

      case SquareStates.TREE:
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(x, y, width, height);
        break;

      case SquareStates.VOID:
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(x, y, width, height);
        break;

      case SquareStates.EMPTY:
      default:
        this.ctx.strokeRect(x, y, width, height);
        break;
    }
  }

  private drawSquares(squareData: number[][]) {
    const squareWidth= this.canvasWidth / this.gridSizeSquares;
    const squareHeight = this.canvasWidth / this.gridSizeSquares;

    for (let x=0; x<this.gridSizeSquares; x++) {
      for (let y=0; y<this.gridSizeSquares; y++) {
        this.drawSquare(
          x*squareWidth,
          y*squareHeight,
          squareWidth,
          squareHeight,
          squareData[x][y],
        );
      }
    }
  }
}
