import { Injectable } from '@angular/core';
import { Piece } from '../models/piece.model';
import { Tile } from '../models/tile.model';

@Injectable({
  providedIn: 'root'
})
export class MoveService {

  private _boardState: Tile[] = [];

  constructor () { }

  public get boardState(): Tile[] {
    return this._boardState
  }

  public set boardState(v: Tile[]) {
    this._boardState = v;
  }


  public newPiece(key: number, x: number, y: number): Piece {
    return {
      key: key,
      name: '',
      abbr: '',
      value: 0,
      player: '',
      x: x,
      y: y
    }
  }

  public possibleMoves(tile: Tile): number[][] {
    // return list of possible moves for selected tile
    let possibleMoves: number[][] = []
    switch (tile.piece.name) {
      case "pawn":
        possibleMoves = [[0, 1], [0, 2], [1, 1], [-1, 1]];
        break;
      case "knight":
        possibleMoves = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]];
        break
      case "king":
        possibleMoves = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
        break
      case "rook":
        possibleMoves = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0],];
        break
      case "bishop":
        possibleMoves = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]];
        break
      case "queen":
        possibleMoves = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]];
        break
    }
    return possibleMoves;
  }

  public existingTiles(oldTile: Tile) {
    let possibleMoves = this.possibleMoves(oldTile);
    let existingTiles: Tile[] = [];

    possibleMoves.forEach(
      (move) => {
        let horizontal = move[0];
        let vertical = move[1];
        let moveAttempt = this.findTile(oldTile.x + horizontal, oldTile.y + vertical);

        if (moveAttempt) {
          // TODO: check tiles between the piece and location to see any blocking pieces
          existingTiles.push(moveAttempt);
        }
      }
    );
    console.log(existingTiles)
    return existingTiles;

  }

  public validateMove(oldTile: Tile, newTile: Tile): boolean {
    let valid: boolean = false;
    let tileList = this.existingTiles(oldTile)

    if (tileList.includes(newTile)) {
      valid = true;
    }

    return valid;
  }

  public movePiece(oldTile: Tile, newTile: Tile): void {
    if ((oldTile.key !== newTile.key)) {
      if (oldTile.piece.player !== newTile.piece.player) {
        if (this.validateMove(oldTile, newTile)) {
          newTile.piece = oldTile.piece;
          oldTile.piece = this.newPiece(oldTile.key, oldTile.x, oldTile.y)
        } else {
          console.error('This is not a possible move');
        }
      } else {
        console.error('This is your own piece');
      }
    } else {
      console.error('This is the same tile!');
    }
  }


  public findTile(x: number, y: number): Tile | undefined {
    return this.boardState.find(
      (tile) => tile.x == x && tile.y == y
    );
  }

  public getMoveNotation(x: number, y: number) {
    return (this.getLetter(x) + y);
  }

  public getLetter(value: number) {
    let letters = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return (letters[value]);
  }

  public updateBoardState(value: Tile[]) {
    this.boardState = value;
  }


}
