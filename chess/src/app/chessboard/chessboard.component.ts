import { Component } from '@angular/core';
import { ValidationData } from "./validation.model";
import { Tile } from "../chess/board/tile.model"
import { Piece } from "../chess/pieces/piece.model"
import { Move, Castling } from "../chess/moves/moves.model"

import { CdkDrag } from "@angular/cdk/drag-drop";
import { HistoryService } from '../chess/moves/history.service';
import { MovesService } from '../chess/moves/moves.service';
import { OptionsService } from '../chess/options/options.service';
import { ChessOptions } from '../chess/options/options.model';
import { PieceLogicService } from '../chess/pieces/piece-logic.service';
import { BoardService } from '../chess/board/board.service';

@Component({
	selector: 'app-chessboard',
	templateUrl: './chessboard.component.html',
	styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent {

	public DEFAULT_FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	public DEFAULT_PIECESET: string = "cburnett";
	public DEFAULT_DISPLAY: string = "Piece Set";
	public DEFAULT_THEMES: string[] = [
		"theme1",
		"theme2",
		"alpha",
		"california",
		"cardinal",
		"cburnett",
		"chess7",
		"chessnut",
		"companion",
		"dubrovny",
		"fantasy",
		"fresca",
		"gioco",
		"governor",
		"horsey",
		"icpieces",
		"kosal",
		"leipzig",
		"letter",
		"libra",
		"maestro",
		"merida",
		"pirouetti",
		"pixel",
		"reillycraig",
		"riohacha",
		"shapes",
		"spatial",
		"staunty",
		"tatiana",
	];

	// //  object for options
	// public options: ChessOptions;

	// list of coordinate letters
	public LETTERS: string[];
	// recorded mouse location (currently unused)
	public mouseLoc: number[];

	public options: ChessOptions;

	// board initiated
	public board: Tile[];
	public currentPlayer: string;
	private castling: Castling;
	public step: string;

	constructor(
		private historyService: HistoryService,
		private moveService: MovesService,
		private optionsService: OptionsService,
		private pieceService: PieceLogicService,
		private boardService: BoardService
	) {
		this.options = optionsService.options;
		this.currentPlayer = moveService.currentPlayer;
		this.optionsService.setDefaults();
		this.board = this.boardService.board;
		this.LETTERS = this.moveService.letters;
		this.step = moveService.step;
	}

	// Main Methods
	private selectTile(tile: Tile): void {
		if (this.currentPlayer === tile.piece.player) {
			this.moveService.storedTile.piece = tile.piece;
			tile.selected = true;
			this.step = "location";
			this.displayMoveableTiles();
		}
	}
	private selectLocation(location: Tile): void {
		if (location.key !== this.moveService.storedTile.piece.key && location.piece.player !== this.moveService.storedTile.piece.player) {
			if (this.validateMove(location, false)) {
				console.log("move is valid");
				this.movePiece(location, 1);
			} else {
				console.log("This is not a valid move");
				this.moveService.storedTile.piece = this.pieceService.createNullPiece(null);
				this.step = "piece";
			}
		} else if (location.piece.player === this.moveService.storedTile.piece.player) {
			if (location.piece.key === this.moveService.storedTile.piece.key) {
				location.selected = false;
				this.step = "piece";
			} else {
				this.selectTile(location);
			}
		} else {
			console.log("this is not a valid location");
			this.moveService.storedTile.piece = this.pieceService.createNullPiece(null);
			this.step = "piece";
			if (location.key === this.moveService.storedTile.piece.key) {
				this.selectTile(location);
			}
		}
	}
	private movePiece(location: Tile, code: number): void {
		let piece = this.moveService.storedTile.piece;
		let capturing = location.piece.value !== 0 ? true : false;
		if (code === 3) {
			capturing = true;
		}
		let move = this.moveService.createMove(this.board[piece.key], location, capturing);

		// change location's piece to selected piece
		this.board[location.key].piece = piece;
		// change selected piece's tile to empty
		this.board[piece.key].piece = this.pieceService.createNullPiece(
			this.board[piece.key].key
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
		this.board.forEach((tile) => {
			// reset the moveable tile markers for each tile
			tile.moveable = false;
		});
		// erase the piece from storage
		this.moveService.storedTile.piece = this.pieceService.createNullPiece(null);
		if (code !== 2) {
			this.currentPlayer = this.currentPlayer == "w" ? "b" : "w";
		}

		this.step = "piece";
	}

	// ------------------------------------

	private defineValidationData(pastLocation: Tile, newLocation: Tile): ValidationData {
		let white: boolean = this.moveService.storedTile.piece.player === "w" ? true : false;
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
		switch (this.moveService.storedTile.piece.name) {
			case "pawn":
				{
					let pawnMoveTile: Tile;
					// 1 - single move
					pawnMoveTile = this.findTile(x, y + 1 * playerValue);
					if (pawnMoveTile.piece.value === 0 && pawnMoveTile.piece.player !== this.moveService.storedTile.piece.player) {
						data.moves.push([x, y + 1 * playerValue, 0]);

						// 2 - double move
						// must be previously unmoved (on its starting row)
						pawnMoveTile = this.findTile(x, y + 2 * playerValue);
						if (pawnMoveTile.piece.value === 0 && pawnMoveTile.piece.player !== this.moveService.storedTile.piece.player && y === startrow) {
							data.moves.push([x, y + 2 * playerValue, 1,]);
						}
					}

					// 3 - capturing Piece
					if (newLocation.piece.value !== 0 && newLocation.piece.player !== this.moveService.storedTile.piece.player) {
						data.moves.push([x + 1, y + 1 * playerValue, 0], [x - 1, y + 1 * playerValue, 0]);
					}

					// 4 - en passanting Piece
					let victim = this.board.find((tile) => tile.enpassantable === true);
					if (victim) {
						// console.log(x2, y2)
						// console.log(victim.x, victim.y)
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

							if (this.findTile(c, y).piece.value !== 0) {
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

							if (this.findTile(x, c).piece.value !== 0) {
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
						if (
							newLocation.piece.player !== this.moveService.storedTile.piece.player
						) {
							data.moves.push([x2, y2, 0]);

							// castling functionality
							if (this.moveService.storedTile.piece.player === "w") {
								if (y === 0) {
									if (x === 0 && this.castling.wlong) {
										// console.log(
										// 	"white can no longer castle long."
										// );
										this.castling.wlong = false;
									} else if (
										x === 7 &&
										this.castling.wshort
									) {
										// console.log(
										// 	"white can no longer castle short."
										// );
										this.castling.wshort = false;
									}
								}
							} else {
								if (y === 7) {
									if (x === 0 && this.castling.blong) {
										// console.log(
										// 	"black can no longer castle long."
										// );
										this.castling.blong = false;
									} else if (
										x === 7 &&
										this.castling.bshort
									) {
										// console.log(
										// 	"black can no longer castle short."
										// );
										this.castling.bshort = false;
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

					if (this.moveService.storedTile.piece.player === "w") {
						pY = 0;
						if (x2 === 6 && this.castling.wshort) {
							cD = "short";
						} else if (x2 === 2 && this.castling.wlong) {
							cD = "long";
						}
					} else if (this.moveService.storedTile.piece.player === "b") {
						pY = 7;
						if (x2 === 6 && this.castling.bshort) {
							cD = "short";
						} else if (x2 === 2 && this.castling.blong) {
							cD = "long";
						}
					}

					if (this.findTile(5, pY).piece.value === 0 && this.findTile(6, pY).piece.value === 0 && cD === "short") {
						data.moves.push([x + 2, y, 0]);
						this.castleAction(pY, 7, 5);
					} else if (this.findTile(2, pY).piece.value === 0 && this.findTile(3, pY).piece.value === 0 && cD === "long") {
						data.moves.push([x - 2, y, 0]);
						this.castleAction(pY, 0, 3);
					}

					// break castle function if king moveService
					if (x === 4) {
						if (this.moveService.storedTile.piece.player === "w" && y === 0) {
							console.log("white can no longer castle.");
							this.castling.wlong = false;
							this.castling.wshort = false;
						} else if (
							this.moveService.storedTile.piece.player === "b" &&
							y === 7
						) {
							console.log("black can no longer castle.");
							this.castling.blong = false;
							this.castling.bshort = false;
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
							if (this.findTile(tilex, tiley).piece.value !== 0) {
								pieceInTheWay = true;
							}
						}
					}

					if (!pieceInTheWay && correctDirection) {
						if (
							newLocation.piece.player !== this.moveService.storedTile.piece.player
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

					// literally just data.moveService like bishop and rook
					if (y === y2) {
						// horizontal
						correctDirection = true;
						min = x < x2 ? x + 1 : x2 + 1;
						max = x < x2 ? x2 - 1 : x - 1;
						for (let c = min; c <= max; c++) {
							if (this.findTile(c, y).piece.value !== 0) {
								pieceInTheWay = true;
							}
						}
					} else if (x === x2) {
						// vertical
						correctDirection = true;
						min = y < y2 ? y + 1 : y2 + 1;
						max = y < y2 ? y2 - 1 : y - 1;
						for (let c = min; c <= max; c++) {
							if (this.findTile(x, c).piece.value !== 0) {
								pieceInTheWay = true;
							}
						}
					} else if (a === b) {
						// diagonal
						correctDirection = true;
						// eg: if dir is positive, x axis goes up by 1 in the tile check
						let dirx = x2 > x ? 1 : -1;
						let diry = y2 > y ? 1 : -1;

						for (let c = 1; c < a; c++) {
							let tilex = x + c * dirx;
							let tiley = y + c * diry;
							if (this.findTile(tilex, tiley).piece.value !== 0) {
								pieceInTheWay = true;
							}
						}
					}

					if (!pieceInTheWay && correctDirection) {
						if (
							newLocation.piece.player !== this.moveService.storedTile.piece.player
						) {
							data.moves.push([x2, y2, 0]);
						}
					}
				}
				break;
		}
		return data;
	}
	private validateMove(newLocation: Tile, checkingAvailableMoves: boolean): boolean {
		let valid: boolean = false;

		let data: ValidationData = this.defineValidationData(
			this.board[this.moveService.storedTile.piece.key],
			newLocation
		);

		data.moves.forEach((move) => {
			if (this.board[newLocation.piece.key].piece.player !== this.currentPlayer) {
				if (move[0] === data.x2 && move[1] === data.y2) {
					valid = true;
					if (!checkingAvailableMoves) {
						this.board.forEach((tile) => {
							tile.enpassantable = false;
						});

						// if move was a double pawn move, and it's not just doing a move display
						if (move[2] === 1) {
							// aha! a sneaky double move... if only if there was a way to do something about this!!!!!!!
							let doubleMovedPawn = this.findTile(data.x2, data.y2 - 1 * data.pV);
							doubleMovedPawn.enpassantable = true;
						} else if (move[2] === 2) {
							let victim = this.findTile(data.x2, data.y2 - 1 * data.pV);
							this.board[victim.key].piece = this.pieceService.createNullPiece(this.board[victim.piece.key].key);
						}
					}
				}
			}
		});

		return valid;
	}

	// ------------------------------------

	private castleAction(pY: number, rX: number, rX2: number): void {
		console.log("rX,rX2:" + rX, rX2);
		let saveTheStoredPiece = this.moveService.storedTile.piece;
		this.moveService.storedTile.piece = this.findTile(rX, pY).piece;
		this.movePiece(this.findTile(rX2, pY), 2);
		this.moveService.storedTile.piece = saveTheStoredPiece;
	}
	private displayMoveableTiles(): void {
		this.board.forEach((tile) => {
			if (this.validateMove(tile, true)) {
				tile.moveable = true;
			}
		});
	}
	// Search Methods
	private findTile(x: number, y: number): Tile {
		return this.board.find((tile) => tile.x === x && tile.y === y);
	}

	// Recording
	private createNotation(move: Move): string {
		let note: string = "";
		let pieceAbbr: string = move.piece.abbr.toUpperCase();

		let pastCoord: string =
			this.moveService.getLetter(move.past[0]) + (move.past[1] + 1);
		let newCoord: string = this.moveService.getLetter(move.new[0]) + (move.new[1] + 1);

		if (move.capturing) {
			pieceAbbr = pieceAbbr === "P" ? pastCoord : pieceAbbr;
			note = pieceAbbr[0] + "x" + newCoord;
		} else {
			note = pieceAbbr === "P" ? newCoord : pieceAbbr + newCoord;
		}
		return note;
	}
	private setTurn(move: Move): void {
		// console.log("move: ", move.current)
		let turn =
			this.currentPlayer === "w"
				? this.historyService.createNewTurn()
				: this.historyService.moveHistory[this.historyService.moveHistory.length - 1];

		if (this.currentPlayer === "w") {
			turn.white = move;
			turn.white.turnNum = turn.num;
			this.historyService.moveHistory.push(turn);
			// console.log(this.turnHistory);
		} else {
			turn.black = move;
			turn.black.turnNum = turn.num;
			// console.log(this.turnHistory);
		}
	}

	// Event Listeners
	public pieceClicked(event: MouseEvent, key: number): void {
		this.mouseLoc = [event.clientX, event.clientY]
		// console.log(this.mouseLoc);

		// INIT
		let tile = this.board.find((tile) => tile.key === key);
		this.board.forEach((tile) => {
			tile.selected = false;
			tile.moveable = false;
		});

		console.log("tile:", this.moveService.getLetter(tile.x) + (tile.y + 1));

		switch (this.step) {
			case "piece":
				if (tile.piece.player === this.currentPlayer) {
					this.selectTile(tile);
				}
				break;
			case "location":
				if (tile.piece.player !== this.currentPlayer) {
					this.selectLocation(tile);
				} else {
					console.log(tile.piece.key, this.moveService.storedTile.piece.key)

					if (tile.piece.key !== this.moveService.storedTile.piece.key) {
						this.selectTile(tile);

					} else {
						this.step = "piece";
					}

				}
				// else if (tile.piece.player === this.currentPlayer && tile.key !== this.moveService.storedTile.key) {
				// 	console.log("keys man")

				// } else {
				// 	this.selectTile(tile);
				// }
				break;
			default:
				console.error("something broke...");
				break;
		}
	}
	public piecePickedUp(event: CdkDrag<Tile>, tile: Tile) {
		console.log(tile);
		// if (this.moveService.storedTile.piece.player === this.currentPlayer) {
		console.log("piece picked up:", tile.piece.name, event);
		this.selectTile(tile);
		// }
	}
	public pieceDropped(tile: Tile) {
		if (this.moveService.storedTile.piece.player !== "" && this.moveService.storedTile.piece.player !== tile.piece.player) {
			this.selectLocation(tile);
		} else {
			console.log("oops");
		}
	}
}
