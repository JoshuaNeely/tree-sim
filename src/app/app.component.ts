import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

import { buildTreeData, ReturnData } from './build-tree-data';
import packagejson from '../../package.json';


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

  canvasWidth: number;
  canvasHeight: number;

  // read from package.json
  version: string = '0.0.0';

  // feedback to the user on the algorithm
  message: string = '';

  private ctx: CanvasRenderingContext2D;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;  


  constructor(private title: Title) {}
  

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'black';

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
    const returnData = this.buildTreeData();
    this.drawSquares(returnData.treeData);
    this.message = returnData.message;
  }

  private buildTreeData(): ReturnData {
    return buildTreeData(this.gridSizeSquares, {x: this.bufferX, y: this.bufferY}, this.numberOfTrees);
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0,0, this.canvasWidth, this.canvasHeight);
  }

  private drawSquare(x: number, y: number, width: number, height: number, filled: boolean) {
    if (filled) {
      this.ctx.fillRect(x, y, width, height);
    } else {
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  private drawSquares(squareData: number[][]) {
    const squareWidth= this.canvasWidth / this.gridSizeSquares;
    const squareHeight = this.canvasWidth / this.gridSizeSquares;

    for (let x=0; x<this.gridSizeSquares; x++) {
      for (let y=0; y<this.gridSizeSquares; y++) {
        const isFilled: boolean = squareData[x][y] === 1;
        
        this.drawSquare(
          x*squareWidth,
          y*squareHeight,
          squareWidth,
          squareHeight,
          isFilled,
        );
      }
    }
  }
}
