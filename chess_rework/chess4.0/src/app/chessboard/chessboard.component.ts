import { Component } from '@angular/core';
import { Piece } from '../models/piece.model';
import { Tile } from '../models/tile.model';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent {
  private _board: Tile[];
  private _letters: string[] = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  public get board(): Tile[] {
    return this._board;
  }
  public set board(value: Tile[]) {
    this._board = value;
  }
  public get letters(): string[] {
    return this.letters;
  }

  constructor() {
    this._board = this.createBoard();
  }

/*
  private createBoard(): Tile[] {
    let newBoard: Tile[] = [];
    let tile: Tile;
    let darkTile: boolean = true;
    let i = 0;
    for (let y = 8; y >= 1; y--) {
      darkTile = !darkTile;
      for (let x = 1; x <= 8; x++) {
         // Testing coordinate letters, this will trigger 64 times.
         console.log(this.getLetter(x), y);
       

        // create
        tile = {
          key: i,
          piece: {
            key: i,
            name: '',
            abbr: '',
            value: 0,
            player: ''
          },
          dark: darkTile,
          coord: [x,y]
        }

        newBoard.push(tile);
        // clean up for next
        i++;
        darkTile = !darkTile;

      }

    }
    newBoard.forEach(
      (tile)=> {
        console.log(`{key:${tile.key},piece:{key:${tile.piece.key},name:'',abbr:'',value:0,player:''}dark:${tile.dark},coord:[${tile.coord[0]},${tile.coord[1]}]}`);}
    );
    return newBoard;
  }
*/
  private createBoard(): Tile[] {
    return [
      { key: 0,  piece: { key: 0, name: "rook", abbr: "r", value: 10, player: "b", }, dark: false, coord: [1, 8] },
      { key: 1,  piece: { key: 1, name: "knight", abbr: "n", value: 9, player: "b", }, dark: true, coord: [2, 8] },
      { key: 2,  piece: { key: 2, name: "bishop", abbr: "b", value: 8, player: "b", }, dark: false, coord: [3, 8] },
      { key: 3,  piece: { key: 3, name: "queen", abbr: "q", value: 11, player: "b", }, dark: true, coord: [4, 8] },
      { key: 4,  piece: { key: 4, name: "king", abbr: "k", value: 12, player: "b", }, dark: false, coord: [5, 8] },
      { key: 5,  piece: { key: 5, name: "bishop", abbr: "b", value: 8, player: "b", }, dark: true, coord: [6, 8] },
      { key: 6,  piece: { key: 6, name: "knight", abbr: "n", value: 9, player: "b", }, dark: false, coord: [7, 8] },
      { key: 7,  piece: { key: 7, name: "rook", abbr: "r", value: 10, player: "b", }, dark: true, coord: [8, 8] },
      { key: 8,  piece: { key: 8, name: "pawn", abbr: "p", value: 7, player: "b", }, dark: true, coord: [1, 7] },
      { key: 9,  piece: { key: 9, name: "pawn", abbr: "p", value: 7, player: "b", }, dark: false, coord: [2, 7] },
      { key: 10, piece: { key: 10, name: "pawn", abbr: "p", value: 7, player: "b", }, dark: true, coord: [3, 7] },
      { key: 11, piece: { key: 11, name: "pawn", abbr: "p", value: 7, player: "b", }, dark: false, coord: [4, 7] },
      { key: 12, piece: { key: 12, name: "pawn", abbr: "p", value: 7, player: "b", }, dark: true, coord: [5, 7] },
      { key: 13, piece: { key: 13, name: "pawn", abbr: "p", value: 7, player: "b", }, dark: false, coord: [6, 7] },
      { key: 14, piece: { key: 14, name: "pawn", abbr: "p", value: 7, player: "b", }, dark: true, coord: [7, 7] },
      { key: 15, piece: { key: 15, name: "pawn", abbr: "p", value: 7, player: "b", }, dark: false, coord: [8, 7] },
      { key: 16, piece: { key: 16, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [1, 6] },
      { key: 17, piece: { key: 17, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [2, 6] },
      { key: 18, piece: { key: 18, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [3, 6] },
      { key: 19, piece: { key: 19, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [4, 6] },
      { key: 20, piece: { key: 20, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [5, 6] },
      { key: 21, piece: { key: 21, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [6, 6] },
      { key: 22, piece: { key: 22, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [7, 6] },
      { key: 23, piece: { key: 23, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [8, 6] },
      { key: 24, piece: { key: 24, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [1, 5] },
      { key: 25, piece: { key: 25, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [2, 5] },
      { key: 26, piece: { key: 26, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [3, 5] },
      { key: 27, piece: { key: 27, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [4, 5] },
      { key: 28, piece: { key: 28, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [5, 5] },
      { key: 29, piece: { key: 29, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [6, 5] },
      { key: 30, piece: { key: 30, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [7, 5] },
      { key: 31, piece: { key: 31, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [8, 5] },
      { key: 32, piece: { key: 32, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [1, 4] },
      { key: 33, piece: { key: 33, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [2, 4] },
      { key: 34, piece: { key: 34, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [3, 4] },
      { key: 35, piece: { key: 35, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [4, 4] },
      { key: 36, piece: { key: 36, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [5, 4] },
      { key: 37, piece: { key: 37, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [6, 4] },
      { key: 38, piece: { key: 38, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [7, 4] },
      { key: 39, piece: { key: 39, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [8, 4] },
      { key: 40, piece: { key: 40, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [1, 3] },
      { key: 41, piece: { key: 41, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [2, 3] },
      { key: 42, piece: { key: 42, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [3, 3] },
      { key: 43, piece: { key: 43, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [4, 3] },
      { key: 44, piece: { key: 44, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [5, 3] },
      { key: 45, piece: { key: 45, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [6, 3] },
      { key: 46, piece: { key: 46, name: "", abbr: "", value: 0, player: "", }, dark: true, coord: [7, 3] },
      { key: 47, piece: { key: 47, name: "", abbr: "", value: 0, player: "", }, dark: false, coord: [8, 3] },
      { key: 48, piece: { key: 48, name: "pawn", abbr: "P", value: 1, player: "w", }, dark: false, coord: [1, 2] },
      { key: 49, piece: { key: 49, name: "pawn", abbr: "P", value: 1, player: "w", }, dark: true, coord: [2, 2] },
      { key: 50, piece: { key: 50, name: "pawn", abbr: "P", value: 1, player: "w", }, dark: false, coord: [3, 2] },
      { key: 51, piece: { key: 51, name: "pawn", abbr: "P", value: 1, player: "w", }, dark: true, coord: [4, 2] },
      { key: 52, piece: { key: 52, name: "pawn", abbr: "P", value: 1, player: "w", }, dark: false, coord: [5, 2] },
      { key: 53, piece: { key: 53, name: "pawn", abbr: "P", value: 1, player: "w", }, dark: true, coord: [6, 2] },
      { key: 54, piece: { key: 54, name: "pawn", abbr: "P", value: 1, player: "w", }, dark: false, coord: [7, 2] },
      { key: 55, piece: { key: 55, name: "pawn", abbr: "P", value: 1, player: "w", }, dark: true, coord: [8, 2] },
      { key: 56, piece: { key: 56, name: "rook", abbr: "R", value: 4, player: "w", }, dark: true, coord: [1, 1] },
      { key: 57, piece: { key: 57, name: "knight", abbr: "N", value: 3, player: "w", }, dark: false, coord: [2, 1] },
      { key: 58, piece: { key: 58, name: "bishop", abbr: "B", value: 2, player: "w", }, dark: true, coord: [3, 1] },
      { key: 59, piece: { key: 59, name: "queen", abbr: "Q", value: 6, player: "w", }, dark: false, coord: [4, 1] },
      { key: 60, piece: { key: 60, name: "king", abbr: "K", value: 5, player: "w", }, dark: true, coord: [5, 1] },
      { key: 61, piece: { key: 61, name: "bishop", abbr: "B", value: 2, player: "w", }, dark: false, coord: [6, 1] },
      { key: 62, piece: { key: 62, name: "knight", abbr: "N", value: 3, player: "w", }, dark: true, coord: [7, 1] },
      { key: 63, piece: { key: 63, name: "rook", abbr: "R", value: 4, player: "w", }, dark: false, coord: [8, 1] }
    ]
  }

  public getLetter(value: number): string {
    return this._letters[value];
  }

  public pieceDropped(tile: Tile):void {
    
  }
}