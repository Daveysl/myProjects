import { Injectable } from "@angular/core";
import { PieceLogicService } from "./piece-logic.service";
import { Move } from "../models/moves.model";
import { Tile } from "../models/tile.model";
import { HistoryService } from "./history.service";
import { BoardService } from "./board.service";
import { ValidationData } from "../models/validation.model";

@Injectable({
	providedIn: "root",
})
export class MovesService {

	private _currentPlayer: string;
	private _storedTile: Tile;
	private _step: string;
	private _letters: string[];

	constructor(
		private historyService: HistoryService,
		private boardService: BoardService,
		private pieceService: PieceLogicService

	) {
		this._letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	}

	// ----- Gets and Sets
	// current player's turn
	get currentPlayer(): string {
		return this._currentPlayer;
	}
	set currentPlayer(value: string) {
		this._currentPlayer = value;
	}
	// stored tile info
	public get storedTile(): Tile {
		return this._storedTile;
	}
	public set storedTile(value: Tile) {
		this._storedTile = value;
	}
	// move step
	public get step(): string {
		return this._step;
	}
	public set step(value: string) {
		this._step = value;
	}
	// letters
	public get letters(): string[] {
		return this._letters;
	}

	// get a letter from letters list
	public getLetter(value: number): string {
		return this.letters[value];
	}
	// create a new move
	public createMove(oldTile: Tile, newTile: Tile, capturing: boolean): Move {
		console.log("createMove", this.getLetter(oldTile.x) + (oldTile.y + 1), this.getLetter(newTile.x) + (newTile.y + 1), capturing)
		let move = this.historyService.initMove();
		move.piece = oldTile.piece;
		move.capturing = capturing;
		move.past = [oldTile.x, oldTile.y];
		move.new = [newTile.x, newTile.y];
		move.fenState = "";
		return move;
	}

	public setTurn(move: Move): void {
		console.log("setTurn");

		let turn =
			this.currentPlayer === "w"
				? this.historyService.createNewTurn()
				: this.historyService.moveHistory[this.historyService.moveHistory.length - 1];

		console.log("currentPlayer:", this.currentPlayer);
		if (this.currentPlayer === "w") {
			turn.white = move;
			turn.white.turnNum = turn.num;
			this.historyService.moveHistory.push(turn);
		} else {
			turn.black = move;
			turn.black.turnNum = turn.num;
		}
	}

	// create the notation for a move
	public createNotation(move: Move): string {
		console.log("createNotation");
		let notation: string = "";
		let pieceAbbr: string = move.piece.abbr.toUpperCase();

		let pastCoord: string = this.getLetter(move.past[0]) + (move.past[1] + 1);
		let newCoord: string = this.getLetter(move.new[0]) + (move.new[1] + 1);

		if (move.capturing) {
			pieceAbbr = pieceAbbr === "P" ? pastCoord : pieceAbbr;
			notation = pieceAbbr[0] + "x" + newCoord;
		} else {
			notation = pieceAbbr === "P" ? newCoord : pieceAbbr + newCoord;
		}
		return notation;
	}
	
	public selectTile(tile: Tile): void {
		console.log("selectTile");
		if (this.currentPlayer === tile.piece.player) {
			this.storedTile.piece = tile.piece;
			tile.selected = true;
			this.step = "location";
			this.displayMoveableTiles();
		}
	}
	public displayMoveableTiles(): void {
		console.log("displayMoveableTiles");
		// console.log("validateMove");
		this.boardService.board.forEach((tile) => {
			if (this.validateMove(tile, true)) {
				tile.moveable = true;
				// console.log(this.getLetter(tile.x), tile.y+1);
			}
		});
		
	}

	public defineValidationData(pastLocation: Tile, newLocation: Tile): ValidationData {
		console.log(this.storedTile.piece.name);
		// console.log(newLocation.piece.name);
		let white: boolean = this.storedTile.piece.player === "w" ? true : false;
		let startrow: number = white ? 1 : 6;
		let playerValue = white ? 1 : -1;

		let data = {
			moves: [],
			x2: newLocation.x,
			y2: newLocation.y,
			pV: playerValue,
		};

		let x = pastLocation.x;
		let y = pastLocation.y;
		let x2 = newLocation.y;
		let y2 = newLocation.y;

		let correctDirection = false;
		let pieceInTheWay = false;
		let min = 0;
		let max = 0;

		// PIECES -------------------------------------
		// picking a location to move

		switch (this.storedTile.piece.name) {
			case "pawn":
				{
					let pawnMoveTile: Tile;
					// 1 - single move
					pawnMoveTile = this.boardService.findTile(x, y + 1 * playerValue);
					if (pawnMoveTile.piece.value === 0 && pawnMoveTile.piece.player !== this.storedTile.piece.player) {
						data.moves.push([x, y + 1 * playerValue, 0]);

						// 2 - double move
						// must be previously unmoved (on its starting row)
						pawnMoveTile = this.boardService.findTile(x, y + 2 * playerValue);
						if (pawnMoveTile.piece.value === 0 && pawnMoveTile.piece.player !== this.storedTile.piece.player && y === startrow) {
							data.moves.push([x, y + 2 * playerValue, 1,]);
						}
					}

					// 3 - capturing Piece
					if (newLocation.piece.value !== 0 && newLocation.piece.player !== this.storedTile.piece.player) {
						data.moves.push([x + 1, y + 1 * playerValue, 0], [x - 1, y + 1 * playerValue, 0]);
					}

					// 4 - en passanting Piece
					let victim = this.boardService.board.find((tile) => tile.enpassantable === true);
					if (victim) {
						if (
							victim.y === y + 1 * playerValue &&
							(victim.x === x + 1 || victim.x === x - 1)
						) {
							data.moves.push([victim.x, victim.y, 2]);
						}
					}
				}
				break;
			case "knight":
				{
					data.moves.push(
						[x + 1, y + 2, 0],
						[x - 1, y + 2, 0],
						[x - 1, y - 2, 0],
						[x + 1, y - 2, 0],
						[x + 2, y + 1, 0],
						[x - 2, y + 1, 0],
						[x - 2, y - 1, 0],
						[x + 2, y - 1, 0]
					);
				}
				break;
			case "rook":
				{
					// have to see if a Piece is in the way
					// 1. loop through each tile in the row away from Piece until it reaches the board end
					// 2. if a tile has a Piece and the Piece is not the new location, flag
					// if y1 is the same as y2: horizontal (only x is changing)

					if (y === y2) {
						// horizontal
						// console.log("horizontal");
						correctDirection = true;
						min = x < x2 ? x + 1 : x2 + 1;
						max = x < x2 ? x2 - 1 : x - 1;
						// console.log("max:" + max, "min:" + min);
						for (let c = min; c <= max; c++) {
							// console.log(this.findLetter(c), y + 1);

							if (this.boardService.findTile(c, y).piece.value !== 0) {
								// console.log(
								// 	`Piece on ${x2},${y2} is in the way!`
								// );
								pieceInTheWay = true;
							}
						}
					} else if (x === x2) {
						// vertical
						// console.log("vertical");
						correctDirection = true;
						min = y < y2 ? y + 1 : y2 + 1;
						max = y < y2 ? y2 - 1 : y - 1;
						// console.log("max:" + max, "min:" + min);
						for (let c = min; c <= max; c++) {
							// console.log(this.findLetter(x), c + 1);

							if (this.boardService.findTile(x, c).piece.value !== 0) {
								pieceInTheWay = true;
								// console.log(
								// 	`Piece on ${this.letters[x2]},${
								// 		y2 + 1
								// 	} is in the way!`
								// );
							}
						}
					}

					if (!pieceInTheWay && correctDirection) {
						if (newLocation.piece.player !== this.storedTile.piece.player) {
							data.moves.push([x2, y2, 0]);

							// castling functionality
							if (this.storedTile.piece.player === "w") {
								if (y === 0) {
									if (x === 0 && this.boardService.castling.wlong) {
										// console.log(
										// 	"white can no longer castle long."
										// );
										this.boardService.castling.wlong = false;
									} else if (
										x === 7 &&
										this.boardService.castling.wshort
									) {
										// console.log(
										// 	"white can no longer castle short."
										// );
										this.boardService.castling.wshort = false;
									}
								}
							} else {
								if (y === 7) {
									if (x === 0 && this.boardService.castling.blong) {
										// console.log(
										// 	"black can no longer castle long."
										// );
										this.boardService.castling.blong = false;
									} else if (
										x === 7 &&
										this.boardService.castling.bshort
									) {
										// console.log(
										// 	"black can no longer castle short."
										// );
										this.boardService.castling.bshort = false;
									}
								}
							}
						}
					}
				}
				break;
			case "king":
				{
					data.moves.push(
						[x + 1, y + 1, 0],
						[x - 1, y + 1, 0],
						[x + 1, y - 1, 0],
						[x - 1, y - 1, 0],
						[x + 1, y, 0],
						[x - 1, y, 0],
						[x, y + 1, 0],
						[x, y - 1, 0]
					);

					// add castling moveService
					let pY = 0; // player Y coord
					let cD = ""; // castling Direction

					if (this.storedTile.piece.player === "w") {
						pY = 0;
						if (x2 === 6 && this.boardService.castling.wshort) {
							cD = "short";
						} else if (x2 === 2 && this.boardService.castling.wlong) {
							cD = "long";
						}
					} else if (this.storedTile.piece.player === "b") {
						pY = 7;
						if (x2 === 6 && this.boardService.castling.bshort) {
							cD = "short";
						} else if (x2 === 2 && this.boardService.castling.blong) {
							cD = "long";
						}
					}

					if (this.boardService.findTile(5, pY).piece.value === 0 && this.boardService.findTile(6, pY).piece.value === 0 && cD === "short") {
						data.moves.push([x + 2, y, 0]);
						this.castleAction(pY, 7, 5);
					} else if (this.boardService.findTile(2, pY).piece.value === 0 && this.boardService.findTile(3, pY).piece.value === 0 && cD === "long") {
						data.moves.push([x - 2, y, 0]);
						this.castleAction(pY, 0, 3);
					}

					// break castle function if king moveService
					if (x === 4) {
						if (this.storedTile.piece.player === "w" && y === 0) {
							console.log("white can no longer castle.");
							this.boardService.castling.wlong = false;
							this.boardService.castling.wshort = false;
						} else if (
							this.storedTile.piece.player === "b" &&
							y === 7
						) {
							console.log("black can no longer castle.");
							this.boardService.castling.blong = false;
							this.boardService.castling.bshort = false;
						}
					}
				}
				break;
			case "bishop":
				{
					let a =
						x2 >= x ? x2 - x : x - x2;
					let b =
						y2 >= y ? y2 - y : y - y2;

					if (a === b) {
						correctDirection = true;
						// eg: if dir is positive, x axis goes up by 1 in the tile check
						let dirx = x2 > x ? 1 : -1;
						let diry = y2 > y ? 1 : -1;

						for (let c = 1; c < a; c++) {
							let tilex = x + c * dirx;
							let tiley = y + c * diry;
							if (this.boardService.findTile(tilex, tiley).piece.value !== 0) {
								pieceInTheWay = true;
							}
						}
					}

					if (!pieceInTheWay && correctDirection) {
						if (
							newLocation.piece.player !== this.storedTile.piece.player
						) {
							data.moves.push([x2, y2, 0]);
						}
					}
				}
				break;
			case "queen":
				{
					let a =
						x2 >= x ? x2 - x : x - x2;
					let b =
						y2 >= y ? y2 - y : y - y2;

					// literally just moves like bishop and rook
					if (y === y2) {
						// console.log("y === y2");
						// console.log(x2, y2);

						// horizontal
						correctDirection = true;
						min = x < x2 ? x + 1 : x2 + 1;
						max = x < x2 ? x2 - 1 : x - 1;
						for (let c = min; c <= max; c++) {
							if (this.boardService.findTile(c, y).piece.value !== 0) {
								
								pieceInTheWay = true;
							}
						}
					} else if (x === x2) {
						// console.log("x === x2");
						// vertical
						correctDirection = true;
						min = y < y2 ? y + 1 : y2 + 1;
						max = y < y2 ? y2 - 1 : y - 1;
						for (let c = min; c <= max; c++) {
							if (this.boardService.findTile(x, c).piece.value !== 0) {
								pieceInTheWay = true;
							}
						}
					} else if (a === b) {
						// console.log("a === b");
						// diagonal
						correctDirection = true;
						// eg: if dir is positive, x axis goes up by 1 in the tile check
						let dirx = x2 > x ? 1 : -1;
						let diry = y2 > y ? 1 : -1;

						for (let c = 1; c < a; c++) {
							let tilex = x + c * dirx;
							let tiley = y + c * diry;
							if (this.boardService.findTile(tilex, tiley).piece.value !== 0) {
								pieceInTheWay = true;
							}
						}
					}

					if (!pieceInTheWay && correctDirection) {
						console.log("!pieceInTheWay && correctDirection");
						if (
							newLocation.piece.player !== this.storedTile.piece.player
						) {
							data.moves.push([x2, y2, 0]);
							console.log("newLocation.piece.player !== this.storedTile.piece.player");
						}
					}
				}
				break;
		}
		
		return data;
	}

	public validateMove(newLocation: Tile, checkingAvailableMoves: boolean): boolean {
		// console.log("validateMove");
		let valid: boolean = false;

		console.log(newLocation.key)

		let data: ValidationData = this.defineValidationData(this.boardService.board[this.storedTile.piece.key], newLocation);
		

		data.moves.forEach((move) => {
			if (this.boardService.board[newLocation.piece.key].piece.player !== this.currentPlayer) {
				if (move[0] === data.x2 && move[1] === data.y2) {
					valid = true;
					if (!checkingAvailableMoves) {
						this.boardService.board.forEach((tile) => {
							tile.enpassantable = false;
						});

						// if move was a double pawn move, and it's not just doing a move display
						if (move[2] === 1) {
							// aha! a sneaky double move... if only if there was a way to do something about this!!!!!!!
							let doubleMovedPawn = this.boardService.findTile(data.x2, data.y2 - 1 * data.pV);
							doubleMovedPawn.enpassantable = true;
						} else if (move[2] === 2) {
							let victim = this.boardService.findTile(data.x2, data.y2 - 1 * data.pV);
							this.boardService.board[victim.key].piece = this.pieceService.createNullPiece(this.boardService.board[victim.piece.key].key);
						}
					}
				}
			}
		});

		return valid;
	}

	public selectLocation(location: Tile): void {
		console.log("selectLocation");
		// is the location and player different?
		if (location.key !== this.storedTile.piece.key && location.piece.player !== this.storedTile.piece.player) {
			// is the move valid?
			if (this.validateMove(location, false)) {
				this.movePiece(location, 1);
			} else {
				this.storedTile.piece = this.pieceService.createNullPiece(null);
				this.step = "piece";
			}
			// player same?
		} else if (location.piece.player === this.storedTile.piece.player) {
			if (location.piece.key === this.storedTile.piece.key) {
				location.selected = false;
				this.step = "piece";
			} else {
				this.selectTile(location);
			}
		} else {
			console.log("this is not a valid location");
			this.storedTile.piece = this.pieceService.createNullPiece(null);
			this.step = "piece";
			if (location.key === this.storedTile.piece.key) {
				this.selectTile(location);
			}
		}
	}

	public importFenValue(fen: string): void {
		console.log("importFenValue")
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

	public movePiece(location: Tile, code: number): void {
		console.log("movePiece");
		let piece = this.storedTile.piece;
		let capturing = location.piece.value !== 0 ? true : false;
		if (code === 3) {
			capturing = true;
		}

		let move = this.createMove(this.boardService.board[piece.key], location, capturing);
		// change location's piece to selected piece
		this.boardService.board[location.key].piece = piece;
		// change selected piece's tile to empty
		this.boardService.board[piece.key].piece = this.pieceService.createNullPiece(
			this.boardService.board[piece.key].key
		);
		// settle the piece into its new location
		location.piece.key = location.key;

		// record move
		this.boardService.updateFenValue();
		this.historyService.moveHistory.forEach((turn) => {
			turn.white.current = false;
			turn.black.current = false;
		});

		move.fenState = this.boardService.fenValue;
		move.notation = this.createNotation(move);
		move.current = true;
		this.setTurn(move);

		// Clearup Loop ----------------------------------------------
		this.boardService.board.forEach((tile) => {
			// reset the moveable tile markers for each tile
			tile.moveable = false;
		});
		// erase the piece from storage
		this.storedTile.piece = this.pieceService.createNullPiece(null);
		if (code !== 2) {
			this.currentPlayer = this.currentPlayer == "w" ? "b" : "w";
		}
		console.log("currentPlayer:", this.currentPlayer);

		this.step = "piece";
	}

	public castleAction(pY: number, rX: number, rX2: number): void {
		console.log("castleAction");
		console.log("rX,rX2:" + rX, rX2);
		let saveTheStoredPiece = this.storedTile.piece;
		this.storedTile.piece = this.boardService.findTile(rX, pY).piece;
		this.movePiece(this.boardService.findTile(rX2, pY), 2);
		this.storedTile.piece = saveTheStoredPiece;
	}
}
