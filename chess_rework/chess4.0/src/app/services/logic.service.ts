import { Injectable } from '@angular/core';
import { Color, Tile } from '../models/types.model';
import { single } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogicService {
  public board: Tile[] = [];
  public availableTiles: Tile[] = [];
  public currentPlayer: Color = null;

  constructor () { }

  public giveValidTiles(tile: Tile, boardState: Tile[], currentPlayer: Color): Tile[] {
    this.availableTiles = [];

    if (tile.piece.color === currentPlayer) {
      this.board = boardState;
      this.currentPlayer = currentPlayer;
      this.getAvailableMoves(tile);

      switch (tile.piece.name) {
        case "pawn": this.pawn(tile); break;
        case "knight": this.knight(); break;
        case "bishop": this.bishop(); break;
        case "rook": this.rook(); break;
        case "queen": this.queen(); break;
        case "king": this.king(); break;
      }
    } else {
      console.error("This is not the player's piece")
    }

    // console.log(this.availableTiles);
    return this.availableTiles;
  }

  public getAvailableMoves(tile: Tile): void {
    // this.availableTiles.push(tile);
    tile.piece.moves.forEach((move) => {
      let moveAttempt = this.findTile(tile.x + move[0], tile.y + move[1]);
      if (moveAttempt) {
        this.availableTiles.push(moveAttempt);
      } else {
        this.availableTiles.push({
          piece: {
            name: '',
            fen: '',
            abbr: '',
            color: null,
            moves: []
          },
          key: -1,
          x: -1,
          y: -1,
          dark: false,
          moveable: false,
          selected: false,
          attacked: false
        });
      }
    });
  }

  public findTile(x: number, y: number): Tile | undefined {
    return this.board.find((tile) => tile.x == x && tile.y == y);
  }

  public checkTile(tile: Tile): boolean {
    if (tile.key == -1) {
      return false;
    } else {
      return true;
    }
  }

  public getLetter(value: number) {
    let letters = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    return (letters[value]);
  }


  // --------------------------------------------------------------------
  // Validate pieces
  public pawn(tile: Tile): void {
    let startingRow = this.currentPlayer === 'w' ? 2 : 7;
    

    // 1. singleMove = x+0, y+1
    let singleMove = this.availableTiles[0];
    // 2. doubleMove = x+0, y+2
    let doubleMove = this.availableTiles[1];
    // 3. attackMove = x+1, y+1
    let attackMoveLeft = this.availableTiles[2];
    // 4. attackMove =  x-1, y+1
    let attackMoveRight = this.availableTiles[3];
    this.availableTiles = [];


    if (this.checkTile(singleMove) && singleMove.piece.color === null) {
      this.availableTiles.push(singleMove);

      if (this.checkTile(doubleMove) && doubleMove.piece.color === null && tile.y === startingRow) {
        this.availableTiles.push(doubleMove);
      }
    }

    if (this.checkTile(attackMoveLeft) && attackMoveLeft.piece.color !== null && attackMoveLeft.piece.color !== this.currentPlayer) {
      this.availableTiles.push(attackMoveLeft);
    }

    if (this.checkTile(attackMoveRight) && attackMoveRight.piece.color !== null && attackMoveRight.piece.color !== this.currentPlayer) {
      this.availableTiles.push(attackMoveRight);
    }
  }

  public knight(): void {
    // super easy
    this.availableTiles = this.availableTiles.filter(t => t.piece.color !== this.currentPlayer);
  }

  public bishop(): void {
    let pieceInTheWay = false;
    let dirC = 1;
    let validTiles: Tile[] = []

    this.availableTiles.forEach(t => {
      if (t.key !== -1) {
        // console.log(this.getLetter(t.x), t.y, t.piece.color, dirC);
        if (t.piece.color === this.currentPlayer) {
          pieceInTheWay = true;
        } else if (t.piece.color !== null && !pieceInTheWay) {
          pieceInTheWay = true;
          validTiles.push(t);

        } else {
          if (!pieceInTheWay) {
            validTiles.push(t);
          }
        }
      }
      if (dirC < 7) { dirC += 1; }
      else { dirC = 1; pieceInTheWay = false; }
    });
    this.availableTiles = validTiles;
  }

  public rook(): void {
      let pieceInTheWay = false;
      let dirC = 1;
      let validTiles: Tile[] = []
  
      this.availableTiles.forEach(t => {
        if (t.key !== -1) {
          if (t.piece.color === this.currentPlayer) {
            pieceInTheWay = true;
          } else if (t.piece.color !== null && !pieceInTheWay) {
            pieceInTheWay = true;
            validTiles.push(t);
  
          } else {
            if (!pieceInTheWay) {
              validTiles.push(t);
            }
          }
        }
        if (dirC < 7) { dirC += 1; }
        else { dirC = 1; pieceInTheWay = false; }
      });
      this.availableTiles = validTiles;
    
  }
  public queen(): void {
    let pieceInTheWay = false;
    let dirC = 1;
    let validTiles: Tile[] = []

    this.availableTiles.forEach(t => {
      if (t.key !== -1) {
        if (t.piece.color === this.currentPlayer) {
          pieceInTheWay = true;
        } else if (t.piece.color !== null && !pieceInTheWay) {
          pieceInTheWay = true;
          validTiles.push(t);
        } else {
          if (!pieceInTheWay) {
            validTiles.push(t);
          }
        }
      }
      if (dirC < 7) { dirC += 1; }
      else { dirC = 1; pieceInTheWay = false; }
    });
    this.availableTiles = validTiles;
  }
  public king(): void {
    this.availableTiles = this.availableTiles.filter(t => t.piece.color !== this.currentPlayer);
  }
}
