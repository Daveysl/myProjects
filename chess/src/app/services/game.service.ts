import { Injectable } from '@angular/core';
import { Tile } from '../models/tile.model';
import { Castling, Move } from '../models/moves.model';
import { BoardService } from './board.service';
import { MovesService } from './moves.service';
import { HistoryService } from './history.service';
import { OptionsService } from './options.service';
import { PieceLogicService } from './piece-logic.service';
import { ValidationData } from '../models/validation.model';
import { Piece } from '../models/piece.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // store saved tile
  private _savedTile: Tile;
  // store current player
  private _currentPlayer: string;
  // store turn step
  private _turnStep: string;
  // store castling status
  private _castlingStatus: Castling;
  // store FEN value of board state
  private _fenValue: string;
  // board state
  private _board: Tile[];

  constructor (
    private boardService: BoardService,
    private pieceService: PieceLogicService,
    private historyService: HistoryService,
    private optionsService: OptionsService,

  ) {
    this.newGame();
    this.board = this.boardService.board;
  }

  // Gets and sets --------------------------------------------------------
  public get savedTile(): Tile { return this._savedTile; }
  public set savedTile(v: Tile) { this._savedTile = v; }

  public get currentPlayer(): string { return this._currentPlayer; }
  public set currentPlayer(v: string) { this._currentPlayer = v; }

  public get turnStep(): string { return this._turnStep; }
  public set turnStep(v: string) { this._turnStep = v; }

  public get castlingStatus(): Castling { return this._castlingStatus; }
  public set castlingStatus(v: Castling) { this._castlingStatus = v; }

  public get fenValue(): string { return this._fenValue; }
  public set fenValue(v: string) { this._fenValue = v; }

  public get board(): Tile[] { return this._board; }
  public set board(v: Tile[]) { this._board = v; }



  // Public methods --------------------------------------------------------
  public log(x: number, y: number, message: string): void {
    console.log(`${message} ${this.boardService.letters[x] + (y + 1)}`)
  }
  // create new game
  public newGame() {
    // initialize board state using board service
    this.boardService.initBoard();
    this.setDefaults();

  }
  // set defaults
  public setDefaults(): void {
    this.savedTile = this.createEmptyTile(null);
    this.currentPlayer = "w";
    this.turnStep = "piece";
    this.historyService.clearHistory();

    this.boardService.castling = {
      wlong: true,
      wshort: true,
      blong: true,
      bshort: true,
    };
    this.importFenValue(this.optionsService.DEFAULT_FEN);
    this.optionsService.setOptionsDefaults();

  }
  // set tile to null
  public createEmptyTile(key: number) {
    return {
      key: key,
      piece: this.pieceService.createNullPiece(null),
      color: false,
      x: 0,
      y: 0,
      selected: false,
      enpassantable: false,
      moveable: false,
    }
  }
  // delegate tasks
  public selectPiece(tile: Tile): void {
    // console.log(tile.key)
    if (this.currentPlayer === tile.piece.player) {
      console.log("piece clicked!")
      this.savedTile.key = tile.key;
      this.savedTile.piece = tile.piece;
      this.savedTile.x = tile.x;
      this.savedTile.y = tile.y;
      tile.selected = true;
      this.turnStep = "location";
      this.displayMoveableTiles();
    }
  }
  public selectLocation(tile: Tile) {
    console.log(`Selecting location`);
    if (tile.key !== this.savedTile.piece.key && tile.piece.player !== this.savedTile.piece.player) {
      console.log(`location different from stored, player different than stored`);
      if (this.validateMove(tile, false)) {
        console.log(`This move is valid, moving piece`);
        this.movePiece(tile, 1);
      } else {
        this.savedTile.piece = this.pieceService.createNullPiece(null);
        this.turnStep = "piece";
      }

    } else if (tile.piece.player === this.savedTile.piece.player) {
      if (tile.piece.key === this.savedTile.piece.key) {
        console.log("This is the same location");
        tile.selected = false;
        this.turnStep = "piece";

      } else {
        this.selectPiece(tile);
      }

    } else {
      console.log("this is not a valid location");
      this.savedTile.piece = this.pieceService.createNullPiece(null);
      this.turnStep = "piece";
      if (tile.key === this.savedTile.piece.key) {
        this.selectPiece(tile);
      }
    }
  }
  public defineValidationData(pastLocation: Tile, newLocation: Tile): ValidationData {

    let white: boolean = this.savedTile.piece.player === "w" ? true : false;
    let startrow: number = white ? 1 : 6;
    let playerValue = white ? 1 : -1;
    let oldx = pastLocation.x;
    let oldy = pastLocation.y;
    let newx = newLocation.x;
    let newy = newLocation.y;

    let data = {
      moves: [],
      selectedLocation: [newLocation.x, newLocation.y],
      pV: playerValue,
    };

    let correctDirection = false;
    let pieceInTheWay = false;
    let min = 0;
    let max = 0;

    // PIECES -------------------------------------
    // picking a location to move
    switch (this.savedTile.piece.name) {
      case "pawn": {
        let oneSpace: Piece;
        let twoSpace: Piece;

        // 1 - single move
        oneSpace = this.boardService.findTile(oldx, oldy + 1 * playerValue).piece;
        // 2 - double move, must be previously unmoved (on its starting row)
        twoSpace = this.boardService.findTile(oldx, oldy + 2 * playerValue).piece;

        if (oneSpace.value === 0 && oneSpace.player !== this.savedTile.piece.player) {
          data.moves.push([oldx, oldy + 1 * playerValue, 0]);
        }
        if (twoSpace.value === 0 && twoSpace.player !== this.savedTile.piece.player && oldy === startrow) {
          data.moves.push([oldx, oldy + 2 * playerValue, 1]);
        }
        // 3 - capturing Piece
        if (newLocation.piece.value !== 0 && newLocation.piece.player !== this.savedTile.piece.player) {
          data.moves.push([oldx + 1, oldy + 1 * playerValue, 0], [oldx - 1, oldy + 1 * playerValue, 0]);
        }
        // 4 - en passanting Piece
        let victim = this.boardService.board.find((tile) => tile.enpassantable === true);
        if (victim) {
          if (victim.y === oldy + 1 * playerValue && (victim.x === oldx + 1 || victim.x === oldx - 1)) {
            data.moves.push([victim.x, victim.y, 2]);
          }
        }
      }
        break;
      case "knight": {
        data.moves.push([oldx + 1, oldy + 2, 0], [oldx - 1, oldy + 2, 0], [oldx - 1, oldy - 2, 0], [oldx + 1, oldy - 2, 0], [oldx + 2, oldy + 1, 0], [oldx - 2, oldy + 1, 0], [oldx - 2, oldy - 1, 0], [oldx + 2, oldy - 1, 0]
        );
      }
        break;
      case "rook": {
        // have to see if a Piece is in the way
        // 1. loop through each tile in the row away from Piece until it reaches the board end
        // 2. if a tile has a Piece and the Piece is not the new location, flag
        // if y1 is the same as y2: horizontal (only x is changing)

        if (oldy === newy) {
          // horizontal
          correctDirection = true;
          min = oldx < newx ? oldx + 1 : newx + 1;
          max = oldx < newx ? newx - 1 : oldx - 1;

          for (let c = min; c <= max; c++) {
            if (this.boardService.findTile(c, oldy).piece.value !== 0) {
              pieceInTheWay = true;
            }
          }
        } else if (oldx === newx) {
          // vertical
          correctDirection = true;
          min = oldy < newy ? oldy + 1 : newy + 1;
          max = oldy < newy ? newy - 1 : oldy - 1;
          for (let c = min; c <= max; c++) {
            if (this.boardService.findTile(oldx, c).piece.value !== 0) {
              pieceInTheWay = true;
            }
          }
        }

        if (!pieceInTheWay && correctDirection) {
          if (newLocation.piece.player !==
            this.savedTile.piece.player
          ) {
            data.moves.push([newx, newy, 0]);

            // castling functionality
            if (this.savedTile.piece.player === "w") {
              if (oldy === 0) {
                if (oldx === 0 && this.boardService.castling.wlong) {
                  this.boardService.castling.wlong = false;

                } else if (oldx === 7 && this.boardService.castling.wshort) {
                  this.boardService.castling.wshort = false;
                }
              }
            } else {
              if (oldy === 7) {
                if (oldx === 0 && this.boardService.castling.blong) {
                  this.boardService.castling.blong = false;

                } else if (oldx === 7 && this.boardService.castling.bshort) {
                  this.boardService.castling.bshort = false;
                }
              }
            }
          }
        }
      }
        break;
      case "king": {
        data.moves.push([oldx + 1, oldy + 1, 0],
          [oldx - 1, oldy + 1, 0],
          [oldx + 1, oldy - 1, 0],
          [oldx - 1, oldy - 1, 0],
          [oldx + 1, oldy, 0],
          [oldx - 1, oldy, 0],
          [oldx, oldy + 1, 0],
          [oldx, oldy - 1, 0]
        );

        // add castling moveService
        let pY = 0; // player Y coord
        let cD = ""; // castling Direction

        if (this.savedTile.piece.player === "w") {
          pY = 0;
          if (newx === 6 && this.boardService.castling.wshort) {
            cD = "short";
          } else if (newx === 2 &&
            this.boardService.castling.wlong
          ) {
            cD = "long";
          }
        } else if (this.savedTile.piece.player === "b") {
          pY = 7;
          if (newx === 6 && this.boardService.castling.bshort) {
            cD = "short";
          } else if (newx === 2 && this.boardService.castling.blong) {
            cD = "long";
          }
        }

        if (this.boardService.findTile(5, pY).piece.value === 0 && this.boardService.findTile(6, pY).piece.value === 0 && cD === "short") {
          data.moves.push([oldx + 2, oldy, 0]);
          console.log("castle short is possible")
          // this.castleAction(pY, 7, 5);
        } else if (this.boardService.findTile(2, pY).piece.value === 0 && this.boardService.findTile(3, pY).piece.value === 0 && cD === "long") {
          data.moves.push([oldx - 2, oldy, 0]);
          console.log("castle long is possible")
          // this.castleAction(pY, 0, 3);
        }

        // break castle function if king moveService
        // if (oldx === 4) {
        // 	if (this.gameService.savedTile.piece.player === "w" && oldy === 0) {
        // 		// console.log("white can no longer castle.");
        // 		this.boardService.castling.wlong = false;
        // 		this.boardService.castling.wshort = false;

        // 	} else if (this.gameService.savedTile.piece.player === "b" && oldy === 7) {
        // 		// console.log("black can no longer castle.");
        // 		this.boardService.castling.blong = false;
        // 		this.boardService.castling.bshort = false;
        // 	}
        // }
      }
        break;
      case "bishop": {
        // console.log("selected piece is bishop")
        let distanceX: number = newx > oldx ? newx - oldx : oldx - newx;
        let distanceY: number = newy >= oldy ? newy - oldy : oldy - newy;

        if (distanceX === distanceY) {
          correctDirection = true;
          // eg: if dir is positive, x axis goes up by 1 in the tile check
          let dirx = newx > oldx ? 1 : -1;
          let diry = newy > oldy ? 1 : -1;

          for (let c = 1; c < distanceX; c++) {
            let tilex = oldx + c * dirx;
            let tiley = oldy + c * diry;
            if (this.boardService.findTile(tilex, tiley).piece.value !== 0) {
              // console.log(`There is a piece between ${this.getNotation(oldx, oldy)} and ${this.getNotation(newx, newy)}`)
              pieceInTheWay = true;
            }
          }
        }

        if (!pieceInTheWay && correctDirection) {
          if (newLocation.piece.player !== this.savedTile.piece.player) {
            data.moves.push([newx, newy, 0]);
            // console.log(`${this.getNotation(newx, newy)} is a valid move`)
          }
        }
      }
        break;
      case "queen": {
        let a = newx >= oldx ? newx - oldx : oldx - newx;
        let b = newy >= oldy ? newy - oldy : oldy - newy;

        // literally just moves like bishop and rook
        if (oldy === newy) {
          // horizontal
          correctDirection = true;
          min = oldx < newx ? oldx + 1 : newx + 1;
          max = oldx < newx ? newx - 1 : oldx - 1;
          for (let c = min; c <= max; c++) {
            if (this.boardService.findTile(c, oldy).piece.value !==
              0
            ) {
              pieceInTheWay = true;
            }
          }
        } else if (oldx === newx) {
          // console.log("x === x2");
          // vertical
          correctDirection = true;
          min = oldy < newy ? oldy + 1 : newy + 1;
          max = oldy < newy ? newy - 1 : oldy - 1;
          for (let c = min; c <= max; c++) {
            if (this.boardService.findTile(oldx, c).piece.value !==
              0
            ) {
              pieceInTheWay = true;
            }
          }
        } else if (a === b) {
          // console.log("a === b");
          // diagonal
          correctDirection = true;
          // eg: if dir is positive, x axis goes up by 1 in the tile check
          let dirx = newx > oldx ? 1 : -1;
          let diry = newy > oldy ? 1 : -1;

          for (let c = 1; c < a; c++) {
            let tilex = oldx + c * dirx;
            let tiley = oldy + c * diry;
            if (this.boardService.findTile(tilex, tiley).piece
              .value !== 0
            ) {
              pieceInTheWay = true;
            }
          }
        }

        if (!pieceInTheWay && correctDirection) {
          if (newLocation.piece.player !==
            this.savedTile.piece.player
          ) {
            data.moves.push([newx, newy, 0]);
          }
        }
      }
        break;
    }

    return data;
  }

  public validateMove(newLocation: Tile, checkingAvailableMoves: boolean): boolean {
    this.log(newLocation.x, newLocation.y, "validating move:");

    let valid: boolean = false;
    let data: ValidationData = this.defineValidationData(this.boardService.board[this.savedTile.piece.key], newLocation);
    // this.log(newLocation.x, newLocation.y, "New location:")
    // this.log(this.boardService.board[this.gameService.savedTile.piece.key].x, this.boardService.board[this.gameService.savedTile.piece.key].y, "piece from the board:")
    let x = data.selectedLocation[0];
    let y = data.selectedLocation[1];
    let pV = data.pV;
    // console.log("Validating tile:", this.getLetter(x)+(y+1))
    // console.log(`displaying valid moves for ${this.getNotation(this.gameService.savedTile.x, this.gameService.savedTile.y)}`)
    data.moves.forEach((move) => {
      // console.log(`checking ${this.getNotation(move[0], move[1])}`)
      if (this.boardService.board[newLocation.piece.key].piece.player !== this.currentPlayer) {

        if (move[0] === x && move[1] === y) {
          valid = true;
          if (!checkingAvailableMoves) {
            this.boardService.board.forEach((tile) => {
              tile.enpassantable = false;
            });

            // if move was a double pawn move, and it's not just doing a move display
            if (move[2] === 1) {
              // aha! a sneaky double move... if only if there was a way to do something about this!!!!!!!
              let doubleMovedPawn = this.boardService.findTile(x, y - 1 * pV);
              doubleMovedPawn.enpassantable = true;
            } else if (move[2] === 2) {
              let victim = this.boardService.findTile(x, y - 1 * pV);
              this.boardService.board[victim.key].piece = this.pieceService.createNullPiece(this.boardService.board[victim.piece.key].key);
            }
          }
        }
      }
    });
    return valid;
  }

  // create the notation for a move
  public createNotation(move: Move): string {
    // console.log("createNotation");
    let notation: string = "";
    let pieceAbbr: string = move.piece.abbr.toUpperCase();

    let pastCoord: string =
      this.boardService.getLetter(move.past[0]) + (move.past[1] + 1);
    let newCoord: string = this.boardService.getLetter(move.new[0]) + (move.new[1] + 1);

    if (move.capturing) {
      pieceAbbr = pieceAbbr === "P" ? pastCoord : pieceAbbr;
      notation = pieceAbbr[0] + "x" + newCoord;
    } else {
      notation = pieceAbbr === "P" ? newCoord : pieceAbbr + newCoord;
    }
    return notation;
  }

  public displayMoveableTiles(): void {
    this.boardService.board.forEach((tile) => {

      if (this.validateMove(tile, true)) {
        this.log(tile.x, tile.y, "valid:");
        tile.moveable = true;
      }
    });
  }

  public movePiece(location: Tile, code: number): void {
    console.log("Moving", this.savedTile.piece.name, "to", this.boardService.getLetter(location.x) + (location.y + 1));

    let piece = this.savedTile.piece;
    let capturing = location.piece.value !== 0 ? true : false;

    if (code === 3) {
      capturing = true;
    }

    let move = this.createMove(this.boardService.board[piece.key], location, capturing);
    // change location's piece to selected piece
    this.board[location.key].piece = piece;
    // change selected piece's tile to empty
    this.board[piece.key].piece = this.pieceService.createNullPiece(this.boardService.board[piece.key].key);
    // settle the piece into its new location
    location.piece.key = location.key;

    // record move
    this.boardService.updateFenValueFromBoardState();
    this.historyService.moveHistory.forEach((turn) => {
      turn.white.current = false;
      turn.black.current = false;
    });

    move.fenState = this.boardService.fenValue;
    move.notation = this.createNotation(move);
    console.log(this.boardService.fenValue);

    move.current = true;
    this.setTurn(move);

    // Clearup Loop ----------------------------------------------
    this.board.forEach((tile) => {
      // reset the moveable tile markers for each tile
      tile.moveable = false;
    });
    // erase the piece from storage
    this.savedTile.piece = this.pieceService.createNullPiece(null);
    if (code !== 2) {
      this.currentPlayer = this.currentPlayer == "w" ? "b" : "w";
    }
    console.log("currentPlayer:", this.currentPlayer);

    this.turnStep = "piece";
  }

  public setTurn(move: Move): void {
    let turn = this.currentPlayer === "w" ? this.historyService.createNewTurn() : this.historyService.moveHistory[this.historyService.moveHistory.length - 1];

    if (this.currentPlayer === "w") {
      turn.white = move;
      turn.white.turnNum = turn.num;
      this.historyService.moveHistory.push(turn);
    } else {
      turn.black = move;
      turn.black.turnNum = turn.num;
    }
  }
  public castleAction(pY: number, rX: number, rX2: number): void {
    console.log("castleAction");
    console.log("rX,rX2:" + rX, rX2);
    let saveTheStoredPiece = this.savedTile.piece;
    this.savedTile.piece = this.boardService.findTile(rX, pY).piece;
    this.movePiece(this.boardService.findTile(rX2, pY), 2);
    this.savedTile.piece = saveTheStoredPiece;
  }
  // create a new move
  public createMove(oldTile: Tile, newTile: Tile, capturing: boolean): Move {
    // console.log("createMove", this.getLetter(oldTile.x) + (oldTile.y + 1), this.getLetter(newTile.x) + (newTile.y + 1), capturing)
    let move = this.historyService.initMove();
    move.piece = oldTile.piece;
    move.capturing = capturing;
    move.past = [oldTile.x, oldTile.y];
    move.new = [newTile.x, newTile.y];
    move.fenState = "";
    return move;
  }

  public importFenValue(fen: string): void {
    let fenArray: string[] = [];

    fen.split("/").forEach((row, i) => {
      if (i === 7) {
        let info = row.split(" ");
        // console.log(info);
        // ['RNBQKBNR', 'w', 'KQkq', '-', '0', '1']
        row = info[0];
        this.currentPlayer = info[1];
      }
      row.split("").forEach((char) => {
        if (+char) {
          for (let i = 0; i < Number(char); i++) {
            fenArray.push("");
          }
        } else {
          fenArray.push(char);
        }
      });
    });

    this.boardService.board.forEach((tile: Tile, i: number) => {
      let newPiece = this.pieceService.findPieceFromChar(fenArray[i]);
      tile.piece.abbr = newPiece.abbr;
      tile.piece.name = newPiece.name;
      tile.piece.player = newPiece.player;
      tile.piece.value = newPiece.value;
    });
  }


}
