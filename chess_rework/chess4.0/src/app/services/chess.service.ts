import { Injectable } from '@angular/core';
import { Tile, Piece, Color } from '../models/types.model';
import { LogicService } from './logic.service';

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  public board: Tile[] = [];

  public fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  public letters: string[] = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  public pieceList: Piece[] = [
    {
      name: '',
      fen: '',
      abbr: '',
      color: null,
      moves: []
    },
    {
      name: 'pawn',
      fen: 'P',
      abbr: '',
      color: 'b',
      moves: [[0, -1], [0, -2], [1, -1], [-1, -1]]
    },
    {
      name: 'knight',
      fen: 'N',
      abbr: 'N',
      color: 'b',
      moves: [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
    },
    {
      name: 'bishop',
      fen: 'B',
      abbr: 'B',
      color: 'b',
      moves: [
        [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7],
        [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7],
        [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7],
        [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]]
    },
    {
      name: 'rook',
      fen: 'R',
      abbr: 'R',
      color: 'b',
      moves: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]]
    },
    {
      name: 'queen',
      fen: 'Q',
      abbr: 'Q',
      color: 'b',
      moves: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]]
    },
    {
      name: 'king',
      fen: 'K',
      abbr: 'K',
      color: 'b',
      moves: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
    },
    {
      name: 'pawn',
      fen: 'p',
      abbr: '',
      color: 'w',
      moves: [[0, 1], [0, 2], [1, 1], [-1, 1]]
    },
    {
      name: 'knight',
      fen: 'n',
      abbr: 'N',
      color: 'w',
      moves: [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
    },
    {
      name: 'bishop',
      fen: 'b',
      abbr: 'B',
      color: 'w',
      moves: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]]
    },
    {
      name: 'rook',
      fen: 'r',
      abbr: 'R',
      color: 'w',
      moves: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]]
    },
    {
      name: 'queen',
      fen: 'q',
      abbr: 'Q',
      color: 'w',
      moves: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]]
    },
    {
      name: 'king',
      fen: 'k',
      abbr: 'K',
      color: 'w',
      moves: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
    },

  ]
  public currentPlayer: Color = 'w';
  public validMove: boolean = false;

  constructor (private logic: LogicService) { }

  // -----------------------------------
  public newPiece(): Piece {
    return this.pieceList[0];
  }

  public findPiece(v: string): Piece {
    let piece = this.pieceList.find((piece) => piece.fen === v);
    return piece ? piece : this.pieceList[0];
  }

  public newTile(key = 0, x = 0, y = 0, dark = false): Tile {
    return {
      piece: this.newPiece(),
      key: key,
      x: x,
      y: y,
      dark: dark,
      moveable: false,
      selected: false,
      attacked: false
    };
  }
  // -----------------------------------

  // public possibleMoves(tile: Tile): number[][] {
  //   // return list of possible moves for selected tile
  //   let possibleMoves: number[][] = []
  //   /**
  //    * move code:
  //    * 0: no extra validation
  //    * 1: check spaces between piece and location for blockers
  //    * 2: pawn double move
  //    * 3: pawn capturing
  //    * 4: pawn en passant
  //    * 5: castle move
  //   */

  //   switch (tile.piece.name) {
  //     case "pawn":
  //       possibleMoves = [[0, 1], [0, 2], [1, 1], [-1, 1]];
  //       break;
  //     case "knight":
  //       possibleMoves = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]];
  //       break
  //     case "king":
  //       possibleMoves = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
  //       break
  //     case "rook":
  //       possibleMoves = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]];
  //       break
  //     case "bishop":
  //       possibleMoves = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]];
  //       break
  //     case "queen":
  //       possibleMoves = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]];
  //       break
  //   }
  //   return possibleMoves;
  // }

  public getValidTiles(oldTile: Tile): Tile[] {
    let validTiles: Tile[] = this.logic.giveValidTiles(oldTile, this.board, this.currentPlayer);

    return validTiles;
  }

  public validateMove(oldTile: Tile, newTile: Tile): boolean {
    let valid: boolean = false;

    if ((oldTile.key !== newTile.key)) {
      if (oldTile.piece.color !== newTile.piece.color) {
        let validTiles = this.logic.giveValidTiles(oldTile, this.board, this.currentPlayer);

        if (validTiles.includes(newTile)) {
          valid = true;
        } else {
          console.error('This is not a possible move');
        }
      } else {
        console.error('This is your own piece');
      }
    } else {
      console.error('This is the same tile!');
    }

    return valid;
  }

  public movePiece(oldTile: Tile, newTile: Tile): void {
    this.validMove = false;
    if (this.validateMove(oldTile, newTile)) {
      newTile.piece = oldTile.piece;
      oldTile.piece = this.newPiece()
      this.currentPlayer = this.currentPlayer === 'w' ? 'b' : 'w';
      this.validMove = true;
    }
  }


  public findTile(x: number, y: number): Tile {
    let tile = this.board.find((tile) => tile.x == x && tile.y == y)
    return tile ? tile : this.newTile();
  }

  public getMoveNotation(x: number, y: number) {
    return (this.getLetter(x) + y);
  }

  public getLetter(value: number) {
    let letters = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return (letters[value]);
  }

  public updateBoardState(value: Tile[]) {
    this.board = value;
  }

  public resetMoveableTiles(): void {
    this.board.forEach(
      (tile) => {
        tile.moveable = false;
      });
  }

  public resetGame(): void {
    this.board = this.createBoard();
    this.updateBoardState(this.board);
    this.currentPlayer = 'w';
  }

  private createBoard(): Tile[] {
    let brd: string[][] = [
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
    ];

    let bString = "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr";
    bString.split('/').forEach(
      char => {
        if (+char) {
          for (let i = 0; i < +char; i++) {
            console.log(this.findPiece(char));
          }

        } else {
          char.split("").forEach((i) => {
            console.log(this.findPiece(i))
          });
        }
      });

    let newBoard: Tile[] = [];
    let tile: Tile;
    let darkTile: boolean = true;
    let key = 0;

    brd.forEach(
      (row, y) => {
        darkTile = !darkTile;
        row.forEach(
          (col, x) => {
            tile = this.newTile(key, x + 1, 8 - y, darkTile);
            tile.piece = this.findPiece(col)

            newBoard.push(tile);
            key++;
            darkTile = !darkTile;
          }
        );
        // console.log(row.toString(), 8 - y)
      }
    )

    return newBoard;
  }

  // private createBoard(): Tile[] {
  //   return [{ key: 0, piece: { key: 0, name: "rook", abbr: "r", value: 10, player: "b", x: 1, y: 8 }, dark: false, x: 1, y: 8, moveable: false }, { key: 1, piece: { key: 1, name: "knight", abbr: "n", value: 9, player: "b", x: 2, y: 8 }, dark: true, x: 2, y: 8, moveable: false }, { key: 2, piece: { key: 2, name: "bishop", abbr: "b", value: 8, player: "b", x: 3, y: 8 }, dark: false, x: 3, y: 8, moveable: false }, { key: 3, piece: { key: 3, name: "queen", abbr: "q", value: 11, player: "b", x: 4, y: 8 }, dark: true, x: 4, y: 8, moveable: false }, { key: 4, piece: { key: 4, name: "king", abbr: "k", value: 12, player: "b", x: 5, y: 8 }, dark: false, x: 5, y: 8, moveable: false }, { key: 5, piece: { key: 5, name: "bishop", abbr: "b", value: 8, player: "b", x: 6, y: 8 }, dark: true, x: 6, y: 8, moveable: false }, { key: 6, piece: { key: 6, name: "knight", abbr: "n", value: 9, player: "b", x: 7, y: 8 }, dark: false, x: 7, y: 8, moveable: false }, { key: 7, piece: { key: 7, name: "rook", abbr: "r", value: 10, player: "b", x: 8, y: 8 }, dark: true, x: 8, y: 8, moveable: false }, { key: 8, piece: { key: 8, name: "pawn", abbr: "p", value: 7, player: "b", x: 1, y: 7 }, dark: true, x: 1, y: 7, moveable: false }, { key: 9, piece: { key: 9, name: "pawn", abbr: "p", value: 7, player: "b", x: 2, y: 7 }, dark: false, x: 2, y: 7, moveable: false }, { key: 10, piece: { key: 10, name: "pawn", abbr: "p", value: 7, player: "b", x: 3, y: 7 }, dark: true, x: 3, y: 7, moveable: false }, { key: 11, piece: { key: 11, name: "pawn", abbr: "p", value: 7, player: "b", x: 4, y: 7 }, dark: false, x: 4, y: 7, moveable: false }, { key: 12, piece: { key: 12, name: "pawn", abbr: "p", value: 7, player: "b", x: 5, y: 7 }, dark: true, x: 5, y: 7, moveable: false }, { key: 13, piece: { key: 13, name: "pawn", abbr: "p", value: 7, player: "b", x: 6, y: 7 }, dark: false, x: 6, y: 7, moveable: false }, { key: 14, piece: { key: 14, name: "pawn", abbr: "p", value: 7, player: "b", x: 7, y: 7 }, dark: true, x: 7, y: 7, moveable: false }, { key: 15, piece: { key: 15, name: "pawn", abbr: "p", value: 7, player: "b", x: 8, y: 7 }, dark: false, x: 8, y: 7, moveable: false }, { key: 16, piece: { key: 16, name: "", abbr: "", value: 0, player: "", x: 1, y: 6 }, dark: false, x: 1, y: 6, moveable: false }, { key: 17, piece: { key: 17, name: "", abbr: "", value: 0, player: "", x: 2, y: 6 }, dark: true, x: 2, y: 6, moveable: false }, { key: 18, piece: { key: 18, name: "", abbr: "", value: 0, player: "", x: 3, y: 6 }, dark: false, x: 3, y: 6, moveable: false }, { key: 19, piece: { key: 19, name: "", abbr: "", value: 0, player: "", x: 4, y: 6 }, dark: true, x: 4, y: 6, moveable: false }, { key: 20, piece: { key: 20, name: "", abbr: "", value: 0, player: "", x: 5, y: 6 }, dark: false, x: 5, y: 6, moveable: false }, { key: 21, piece: { key: 21, name: "", abbr: "", value: 0, player: "", x: 6, y: 6 }, dark: true, x: 6, y: 6, moveable: false }, { key: 22, piece: { key: 22, name: "", abbr: "", value: 0, player: "", x: 7, y: 6 }, dark: false, x: 7, y: 6, moveable: false }, { key: 23, piece: { key: 23, name: "", abbr: "", value: 0, player: "", x: 8, y: 6 }, dark: true, x: 8, y: 6, moveable: false }, { key: 24, piece: { key: 24, name: "", abbr: "", value: 0, player: "", x: 1, y: 5 }, dark: true, x: 1, y: 5, moveable: false }, { key: 25, piece: { key: 25, name: "", abbr: "", value: 0, player: "", x: 2, y: 5 }, dark: false, x: 2, y: 5, moveable: false }, { key: 26, piece: { key: 26, name: "", abbr: "", value: 0, player: "", x: 3, y: 5 }, dark: true, x: 3, y: 5, moveable: false }, { key: 27, piece: { key: 27, name: "", abbr: "", value: 0, player: "", x: 4, y: 5 }, dark: false, x: 4, y: 5, moveable: false }, { key: 28, piece: { key: 28, name: "", abbr: "", value: 0, player: "", x: 5, y: 5 }, dark: true, x: 5, y: 5, moveable: false }, { key: 29, piece: { key: 29, name: "", abbr: "", value: 0, player: "", x: 6, y: 5 }, dark: false, x: 6, y: 5, moveable: false }, { key: 30, piece: { key: 30, name: "", abbr: "", value: 0, player: "", x: 7, y: 5 }, dark: true, x: 7, y: 5, moveable: false }, { key: 31, piece: { key: 31, name: "", abbr: "", value: 0, player: "", x: 8, y: 5 }, dark: false, x: 8, y: 5, moveable: false }, { key: 32, piece: { key: 32, name: "", abbr: "", value: 0, player: "", x: 1, y: 4 }, dark: false, x: 1, y: 4, moveable: false }, { key: 33, piece: { key: 33, name: "", abbr: "", value: 0, player: "", x: 2, y: 4 }, dark: true, x: 2, y: 4, moveable: false }, { key: 34, piece: { key: 34, name: "", abbr: "", value: 0, player: "", x: 3, y: 4 }, dark: false, x: 3, y: 4, moveable: false }, { key: 35, piece: { key: 35, name: "", abbr: "", value: 0, player: "", x: 4, y: 4 }, dark: true, x: 4, y: 4, moveable: false }, { key: 36, piece: { key: 36, name: "", abbr: "", value: 0, player: "", x: 5, y: 4 }, dark: false, x: 5, y: 4, moveable: false }, { key: 37, piece: { key: 37, name: "", abbr: "", value: 0, player: "", x: 6, y: 4 }, dark: true, x: 6, y: 4, moveable: false }, { key: 38, piece: { key: 38, name: "", abbr: "", value: 0, player: "", x: 7, y: 4 }, dark: false, x: 7, y: 4, moveable: false }, { key: 39, piece: { key: 39, name: "", abbr: "", value: 0, player: "", x: 8, y: 4 }, dark: true, x: 8, y: 4, moveable: false }, { key: 40, piece: { key: 40, name: "", abbr: "", value: 0, player: "", x: 1, y: 3 }, dark: true, x: 1, y: 3, moveable: false }, { key: 41, piece: { key: 41, name: "", abbr: "", value: 0, player: "", x: 2, y: 3 }, dark: false, x: 2, y: 3, moveable: false }, { key: 42, piece: { key: 42, name: "", abbr: "", value: 0, player: "", x: 3, y: 3 }, dark: true, x: 3, y: 3, moveable: false }, { key: 43, piece: { key: 43, name: "", abbr: "", value: 0, player: "", x: 4, y: 3 }, dark: false, x: 4, y: 3, moveable: false }, { key: 44, piece: { key: 44, name: "", abbr: "", value: 0, player: "", x: 5, y: 3 }, dark: true, x: 5, y: 3, moveable: false }, { key: 45, piece: { key: 45, name: "", abbr: "", value: 0, player: "", x: 6, y: 3 }, dark: false, x: 6, y: 3, moveable: false }, { key: 46, piece: { key: 46, name: "", abbr: "", value: 0, player: "", x: 7, y: 3 }, dark: true, x: 7, y: 3, moveable: false }, { key: 47, piece: { key: 47, name: "", abbr: "", value: 0, player: "", x: 8, y: 3 }, dark: false, x: 8, y: 3, moveable: false }, { key: 48, piece: { key: 48, name: "pawn", abbr: "P", value: 1, player: "w", x: 1, y: 2 }, dark: false, x: 1, y: 2, moveable: false }, { key: 49, piece: { key: 49, name: "pawn", abbr: "P", value: 1, player: "w", x: 2, y: 2 }, dark: true, x: 2, y: 2, moveable: false }, { key: 50, piece: { key: 50, name: "pawn", abbr: "P", value: 1, player: "w", x: 3, y: 2 }, dark: false, x: 3, y: 2, moveable: false }, { key: 51, piece: { key: 51, name: "pawn", abbr: "P", value: 1, player: "w", x: 4, y: 2 }, dark: true, x: 4, y: 2, moveable: false }, { key: 52, piece: { key: 52, name: "pawn", abbr: "P", value: 1, player: "w", x: 5, y: 2 }, dark: false, x: 5, y: 2, moveable: false }, { key: 53, piece: { key: 53, name: "pawn", abbr: "P", value: 1, player: "w", x: 6, y: 2 }, dark: true, x: 6, y: 2, moveable: false }, { key: 54, piece: { key: 54, name: "pawn", abbr: "P", value: 1, player: "w", x: 7, y: 2 }, dark: false, x: 7, y: 2, moveable: false }, { key: 55, piece: { key: 55, name: "pawn", abbr: "P", value: 1, player: "w", x: 8, y: 2 }, dark: true, x: 8, y: 2, moveable: false }, { key: 56, piece: { key: 56, name: "rook", abbr: "R", value: 4, player: "w", x: 1, y: 1 }, dark: true, x: 1, y: 1, moveable: false }, { key: 57, piece: { key: 57, name: "knight", abbr: "N", value: 3, player: "w", x: 2, y: 1 }, dark: false, x: 2, y: 1, moveable: false }, { key: 58, piece: { key: 58, name: "bishop", abbr: "B", value: 2, player: "w", x: 3, y: 1 }, dark: true, x: 3, y: 1, moveable: false }, { key: 59, piece: { key: 59, name: "queen", abbr: "Q", value: 6, player: "w", x: 4, y: 1 }, dark: false, x: 4, y: 1, moveable: false }, { key: 60, piece: { key: 60, name: "king", abbr: "K", value: 5, player: "w", x: 5, y: 1 }, dark: true, x: 5, y: 1, moveable: false }, { key: 61, piece: { key: 61, name: "bishop", abbr: "B", value: 2, player: "w", x: 6, y: 1 }, dark: false, x: 6, y: 1, moveable: false }, { key: 62, piece: { key: 62, name: "knight", abbr: "N", value: 3, player: "w", x: 7, y: 1 }, dark: true, x: 7, y: 1, moveable: false }, { key: 63, piece: { key: 63, name: "rook", abbr: "R", value: 4, player: "w", x: 8, y: 1 }, dark: false, x: 8, y: 1, moveable: false }]
  // }

}
