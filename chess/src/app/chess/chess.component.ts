/**
 * Made by Sam Davey
 * 
 * 
 */


import { Component } from '@angular/core';
import { Piece, Tile } from './chess.model'

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent {
  
  public board:Tile[] = [];
  public pieces: Piece[] = [
    {
      key: null, // ID of tile
      name: "", // name of piece
      abbr: "", // abbreviation of name
      value: 0, // numeric ID of piece
      player: "", // name of player
    },
    {
      key: null,
      name: "pawn",
      abbr: "",
      value: 1,
      player: "white"
    },
    {
      key: null,
      name: "bishop",
      abbr: "B",
      value: 2,
      player: "white"
    },
    {
      key: null,
      name: "knight",
      abbr: "N",
      value: 3,
      player: "white"
    },
    {
      key: null,
      name: "rook",
      abbr: "R",
      value: 4,
      player: "white"
    },
    {
      key: null,
      name: "king",
      abbr: "K",
      value: 5,
      player: "white"
    },
    {
      key: null,
      name: "queen",
      abbr: "Q",
      value: 6,
      player: "white"
    },
    {
      key: null,
      name: "pawn",
      abbr: "",
      value: 7,
      player: "black"
    },
    {
      key: null,
      name: "bishop",
      abbr: "B",
      value: 8,
      player: "black"
    },
    {
      key: null,
      name: "knight",
      abbr: "N",
      value: 9,
      player: "black"
    },
    {
      key: null,
      name: "rook",
      abbr: "R",
      value: 10,
      player: "black"
    },
    {
      key: null,
      name: "queen",
      abbr: "Q",
      value: 11,
      player: "black"
    },
    {
      key: null, 
      name: "king",
      abbr: "K",
      value: 12,
      player: "black"
    }
  ]
  private letters: string[] = ["a","b","c","d","e","f","g","h"]

  public storedPiece: Piece;
  public turn: string;
  private stage:string;
  private castling: boolean;

  constructor() {
    this.genBoard(); 
    this.storedPiece = this.getNull(null);
    this.turn = "white";
    this.stage = "piece";
  }

  private getNull(key: number) {
    return {
      key: key, // ID of tile
      name: "", // name of piece
      abbr: "", // abbreviation of name
      value: 0, // numeric ID of piece
      player: "", // name of player
    }
  }

  public getLetter(x: number): string {
    return this.letters[x];
  }

  public genBoard() {
    let darkTile = false;
    let i = 0;
    let boardState = [
      10, 9, 8,11,12, 8, 9,10,  
       7, 7, 7, 7, 7, 7, 7, 7,
       0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 0, 0, 0,
       1, 1, 1, 1, 1, 1, 1, 1,
       4, 3, 2, 6, 5, 2, 3, 4,
    ];

    for (let y = 7; y >= 0; y--) {
      for (let x = 0; x < 8; x++) {
        let value = boardState[i];        
        let defaultPiece = this.pieces.find((piece) => piece.value === value);
        let key = i;

        if (x !== 0) {
          darkTile = !darkTile;
        }

        let piece: Piece = {
          key: key, 
          name: defaultPiece.name,
          abbr: defaultPiece.abbr,
          value: defaultPiece.value,
          player: defaultPiece.player
        }
        
        let tile: Tile = {
          key: key, 
          piece: piece,
          color: darkTile,
          x: x,
          y: y,
          selected: false,
          enpassant: false,
          moveable: false
        };

        this.board.push(tile);
        i++;
      }
    }
  }

  public pieceClicked(key:number): void {
    // INIT
    let tile = this.board.find(tile => tile.key === key);
    this.board.forEach(tile => {tile.selected = false; tile.moveable = false; });
    console.log("clicked:", this.letters[tile.x], tile.y+1);

    // STAGES: 
    // 1. Select piece
    // 2. Error check
    // 3. Select Location
    // 4. Error check
    // 5. Remove past piece and insert into location
    // 6. Change turn to other player

    /* 
      2 clicks: 
      1st must be your own piece, 
      2nd must be an empty tile or an opponent's piece
    */
   
    switch (this.stage) {
      case "piece":
        this.selectPiece(tile);
        break;
      case "location":
        this.selectLocation(tile);
        break;
      default:
        console.error("something broke...");
        break;
    }
  }

  private selectPiece(tile:Tile): void {
    if (this.turn === tile.piece.player) {
      // console.log(`the turn is ${this.turn}'s and the selected piece belongs to ${tile.piece.player}`)
      this.storedPiece = tile.piece;
      tile.selected = true;
      this.stage = "location";
    }
  }

  private selectLocation(location:Tile): void {
    // console.log("--- location stage");
    if (location.key !== this.storedPiece.key && location.piece.player !== this.storedPiece.player) {
      // console.log("selected location:", location);
      if (this.validateMove(location)) {
        console.log("move is valid");
        this.movePiece(location);

      } else {
        console.log("This is not a valid move");
        this.storedPiece = this.getNull(null);
        this.stage = "piece";
      }

    } else {
      console.log("this is not a valid location");
      this.storedPiece = this.getNull(null);
      this.stage = "piece";
      if (location.key === this.storedPiece.key) this.selectPiece(location);
      
    }
  }

  private movePiece(location: Tile): void {
    // console.log("--- moving stage");
    let piece = this.storedPiece;

    // change location's piece to selected piece
    this.board[location.key].piece = piece;

    // change selected piece's tile to empty
    this.board[piece.key].piece = this.getNull(this.board[piece.key].key);
    
    // settle the piece into its new location
    location.piece.key = location.key;

    // Clearup Loop ----------------------------------------------
    this.board.forEach(tile => {
      // reset the moveable tile markers for each tile
      tile.moveable = false;
    });
    
    // erase the piece from storage
    this.storedPiece = this.getNull(null);

    this.turn = (this.turn == "white") ? "black" : "white";
    // console.log(this.turn + "'s turn");

    this.stage = "piece";
  }

  private validateMove (newLocation: Tile): boolean {
    // DECLARE VARIABLES --------------------------------------------------------------
    let isValid: boolean = false; // is the move valid?
    let moves: number[][] = []; // possible moves 

    let piece: Piece = this.storedPiece; // stored piece
    let pastLocation: Tile = this.board[this.storedPiece.key] // tile on board
    let white: boolean = piece.player === "white" ? true : false; // is the piece white?
    
    let x:number = pastLocation.x; // old location row
    let y:number = pastLocation.y; // old location col
    
    let x2:number = newLocation.x; // new location row
    let y2:number = newLocation.y; // new location col

    // pawn
    // starting row 2 or 7 based on player
    let startrow: number = white ? 1 : 6;
    // p turns number negative if piece is not white
    let p: number = white ? 1 : -1;

    // PIECES -------------------------------------
    // picking a location to move
    if (piece.name === "pawn") {
      // 1 - single move
      if (this.checkTile(x, y + 1*p)) {
        moves.push([x, y + 1*p]); 

        // 2 - double move
        // must be previously unmoved (on its starting row)
        if (this.checkTile(x, y + 2*p) && y === startrow) {
          moves.push([x, y + 2*p]); 
        }
      }

      // 3 - capturing piece
      if ((newLocation.piece.value !== 0) && (newLocation.piece.player !== this.storedPiece.player)) { 
        moves.push([x + 1, y + 1*p], [x - 1, y + 1*p]);
      }

      // 4 - en passanting piece
      if (this.board.find(tile => tile.enpassant === true)) {
        let victim = this.board.find(tile => tile.enpassant === true);
        
        if (victim.y === y) {
          if (victim.x === x+1) {
            moves.push([x + 1, y + 1*p]);
            victim.piece = victim.piece = this.getNull(victim.key);
            
          } else if (victim.x === x-1) {
            moves.push([x - 1, y + 1*p]);
            victim.piece = victim.piece = this.getNull(victim.key);
          }
        }        
      }
      
    }

    // Moves Loop ----------------------------------------------
    // go through each possible move and see if the new location matches 
    // console.log(moves);
    moves.forEach(move => {
      // console.log(this.getLetter(move[0]) + (move[1]+1));

      // EN PASSANT - if a pawn completed a special 2 move , temporarily declare it as enpassantable to possible attackers 
      // - reusing a pawn variable to turn negative or positive based on player
      if (y2 === y + 2*p && !newLocation.enpassant) {
        console.log(this.getLetter(x2) + (y2+1), "is enpassantable");
        newLocation.enpassant = true;
      }
      
      // FIND MOVE --------------------------
      // if the move[x,y] matches the new location x,y
      if (move[0] === x2 && move[1] === y2) {
        isValid = true;
      }
    });
    return isValid;
  }

  private getPawn (): number[][] {
    let moves: number[][] = [];

    return moves;
  }

  // Used to check if a tile is empty, or if there is a piece that the opposing player owns
  private checkTile (x: number, y: number): boolean {
    let valid = false;
    // if the tile has a piece in it, it is not valid.
    let tile = this.getTile(x,y);

    if (tile.piece.value === 0 && tile.piece.player !== this.storedPiece.player) {
      valid = true;
    }

    return valid;
  }
  
  private getTile(x: number, y: number): Tile {
    return this.board.find(tile => tile.x === x && tile.y === y);
  }

} // ENDING BRACE