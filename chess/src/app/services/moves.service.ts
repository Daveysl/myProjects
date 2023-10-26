import { Injectable } from "@angular/core";
import { PieceLogicService } from "./piece-logic.service";
import { Move } from "../models/moves.model";
import { Tile } from "../models/tile.model";
import { Piece } from "../models/piece.model";
import { HistoryService } from "./history.service";
import { BoardService } from "./board.service";
import { ValidationData } from "../models/validation.model";

@Injectable({
	providedIn: "root",
})
export class MovesService {
	private _currentPlayer: string;
	// private _gameService.savedTile: Tile;
	private _step: string;
	private _letters: string[];

	constructor (
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
	public getNotation(x: number, y: number): string {
		return (this.getLetter(x) + (y + 1))
	}



	// create the notation for a move
	public createNotation(move: Move): string {
		// console.log("createNotation");
		let notation: string = "";
		let pieceAbbr: string = move.piece.abbr.toUpperCase();

		let pastCoord: string =
			this.getLetter(move.past[0]) + (move.past[1] + 1);
		let newCoord: string = this.getLetter(move.new[0]) + (move.new[1] + 1);

		if (move.capturing) {
			pieceAbbr = pieceAbbr === "P" ? pastCoord : pieceAbbr;
			notation = pieceAbbr[0] + "x" + newCoord;
		} else {
			notation = pieceAbbr === "P" ? newCoord : pieceAbbr + newCoord;
		}
		return notation;
	}

	// public log(x: number, y: number, message: string): void {
	// 	console.log(`${message} ${this.getNotation(x, y)}`)
	// }



	// public defineValidationData(pastLocation: Tile, newLocation: Tile): ValidationData {
	// 	let white: boolean = this.gameService.savedTile.piece.player === "w" ? true : false;
	// 	let startrow: number = white ? 1 : 6;
	// 	let playerValue = white ? 1 : -1;
	// 	let oldx = pastLocation.x;
	// 	let oldy = pastLocation.y;
	// 	let newx = newLocation.x;
	// 	let newy = newLocation.y;

	// 	let data = {
	// 		moves: [],
	// 		selectedLocation: [newLocation.x, newLocation.y],
	// 		pV: playerValue,
	// 	};

	// 	let correctDirection = false;
	// 	let pieceInTheWay = false;
	// 	let min = 0;
	// 	let max = 0;

	// 	// PIECES -------------------------------------
	// 	// picking a location to move
	// 	switch (this.gameService.savedTile.piece.name) {
	// 		case "pawn": {
	// 			let oneSpace: Piece;
	// 			let twoSpace: Piece;

	// 			// 1 - single move
	// 			oneSpace = this.boardService.findTile(oldx, oldy + 1 * playerValue).piece;
	// 			// 2 - double move, must be previously unmoved (on its starting row)
	// 			twoSpace = this.boardService.findTile(oldx, oldy + 2 * playerValue).piece;

	// 			if (oneSpace.value === 0 && oneSpace.player !== this.gameService.savedTile.piece.player) {
	// 				data.moves.push([oldx, oldy + 1 * playerValue, 0]);
	// 			}
	// 			if (twoSpace.value === 0 && twoSpace.player !== this.gameService.savedTile.piece.player && oldy === startrow) {
	// 				data.moves.push([oldx, oldy + 2 * playerValue, 1]);
	// 			}
	// 			// 3 - capturing Piece
	// 			if (newLocation.piece.value !== 0 && newLocation.piece.player !== this.gameService.savedTile.piece.player) {
	// 				data.moves.push([oldx + 1, oldy + 1 * playerValue, 0], [oldx - 1, oldy + 1 * playerValue, 0]);
	// 			}
	// 			// 4 - en passanting Piece
	// 			let victim = this.boardService.board.find((tile) => tile.enpassantable === true);
	// 			if (victim) {
	// 				if (victim.y === oldy + 1 * playerValue && (victim.x === oldx + 1 || victim.x === oldx - 1)) {
	// 					data.moves.push([victim.x, victim.y, 2]);
	// 				}
	// 			}
	// 		}
	// 			break;
	// 		case "knight": {
	// 			data.moves.push([oldx + 1, oldy + 2, 0], [oldx - 1, oldy + 2, 0], [oldx - 1, oldy - 2, 0], [oldx + 1, oldy - 2, 0], [oldx + 2, oldy + 1, 0], [oldx - 2, oldy + 1, 0], [oldx - 2, oldy - 1, 0], [oldx + 2, oldy - 1, 0]
	// 			);
	// 		}
	// 			break;
	// 		case "rook": {
	// 			// have to see if a Piece is in the way
	// 			// 1. loop through each tile in the row away from Piece until it reaches the board end
	// 			// 2. if a tile has a Piece and the Piece is not the new location, flag
	// 			// if y1 is the same as y2: horizontal (only x is changing)

	// 			if (oldy === newy) {
	// 				// horizontal
	// 				correctDirection = true;
	// 				min = oldx < newx ? oldx + 1 : newx + 1;
	// 				max = oldx < newx ? newx - 1 : oldx - 1;

	// 				for (let c = min; c <= max; c++) {
	// 					if (this.boardService.findTile(c, oldy).piece.value !== 0) {
	// 						pieceInTheWay = true;
	// 					}
	// 				}
	// 			} else if (oldx === newx) {
	// 				// vertical
	// 				correctDirection = true;
	// 				min = oldy < newy ? oldy + 1 : newy + 1;
	// 				max = oldy < newy ? newy - 1 : oldy - 1;
	// 				for (let c = min; c <= max; c++) {
	// 					if (this.boardService.findTile(oldx, c).piece.value !== 0) {
	// 						pieceInTheWay = true;
	// 					}
	// 				}
	// 			}

	// 			if (!pieceInTheWay && correctDirection) {
	// 				if (newLocation.piece.player !==
	// 					this.gameService.savedTile.piece.player
	// 				) {
	// 					data.moves.push([newx, newy, 0]);

	// 					// castling functionality
	// 					if (this.gameService.savedTile.piece.player === "w") {
	// 						if (oldy === 0) {
	// 							if (oldx === 0 && this.boardService.castling.wlong) {
	// 								this.boardService.castling.wlong = false;

	// 							} else if (oldx === 7 && this.boardService.castling.wshort) {
	// 								this.boardService.castling.wshort = false;
	// 							}
	// 						}
	// 					} else {
	// 						if (oldy === 7) {
	// 							if (oldx === 0 && this.boardService.castling.blong) {
	// 								this.boardService.castling.blong = false;

	// 							} else if (oldx === 7 && this.boardService.castling.bshort) {
	// 								this.boardService.castling.bshort = false;
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}
	// 		}
	// 			break;
	// 		case "king": {
	// 			data.moves.push([oldx + 1, oldy + 1, 0],
	// 				[oldx - 1, oldy + 1, 0],
	// 				[oldx + 1, oldy - 1, 0],
	// 				[oldx - 1, oldy - 1, 0],
	// 				[oldx + 1, oldy, 0],
	// 				[oldx - 1, oldy, 0],
	// 				[oldx, oldy + 1, 0],
	// 				[oldx, oldy - 1, 0]
	// 			);

	// 			// add castling moveService
	// 			let pY = 0; // player Y coord
	// 			let cD = ""; // castling Direction

	// 			if (this.gameService.savedTile.piece.player === "w") {
	// 				pY = 0;
	// 				if (newx === 6 && this.boardService.castling.wshort) {
	// 					cD = "short";
	// 				} else if (newx === 2 &&
	// 					this.boardService.castling.wlong
	// 				) {
	// 					cD = "long";
	// 				}
	// 			} else if (this.gameService.savedTile.piece.player === "b") {
	// 				pY = 7;
	// 				if (newx === 6 && this.boardService.castling.bshort) {
	// 					cD = "short";
	// 				} else if (newx === 2 && this.boardService.castling.blong) {
	// 					cD = "long";
	// 				}
	// 			}

	// 			if (this.boardService.findTile(5, pY).piece.value === 0 && this.boardService.findTile(6, pY).piece.value === 0 && cD === "short") {
	// 				data.moves.push([oldx + 2, oldy, 0]);
	// 				console.log("castle short is possible")
	// 				// this.castleAction(pY, 7, 5);
	// 			} else if (this.boardService.findTile(2, pY).piece.value === 0 && this.boardService.findTile(3, pY).piece.value === 0 && cD === "long") {
	// 				data.moves.push([oldx - 2, oldy, 0]);
	// 				console.log("castle long is possible")
	// 				// this.castleAction(pY, 0, 3);
	// 			}

	// 			// break castle function if king moveService
	// 			// if (oldx === 4) {
	// 			// 	if (this.gameService.savedTile.piece.player === "w" && oldy === 0) {
	// 			// 		// console.log("white can no longer castle.");
	// 			// 		this.boardService.castling.wlong = false;
	// 			// 		this.boardService.castling.wshort = false;

	// 			// 	} else if (this.gameService.savedTile.piece.player === "b" && oldy === 7) {
	// 			// 		// console.log("black can no longer castle.");
	// 			// 		this.boardService.castling.blong = false;
	// 			// 		this.boardService.castling.bshort = false;
	// 			// 	}
	// 			// }
	// 		}
	// 			break;
	// 		case "bishop": {
	// 			// console.log("selected piece is bishop")
	// 			let distanceX: number = newx > oldx ? newx - oldx : oldx - newx;
	// 			let distanceY: number = newy >= oldy ? newy - oldy : oldy - newy;

	// 			if (distanceX === distanceY) {
	// 				correctDirection = true;
	// 				// eg: if dir is positive, x axis goes up by 1 in the tile check
	// 				let dirx = newx > oldx ? 1 : -1;
	// 				let diry = newy > oldy ? 1 : -1;

	// 				for (let c = 1; c < distanceX; c++) {
	// 					let tilex = oldx + c * dirx;
	// 					let tiley = oldy + c * diry;
	// 					if (this.boardService.findTile(tilex, tiley).piece.value !== 0) {
	// 						// console.log(`There is a piece between ${this.getNotation(oldx, oldy)} and ${this.getNotation(newx, newy)}`)
	// 						pieceInTheWay = true;
	// 					}
	// 				}
	// 			}

	// 			if (!pieceInTheWay && correctDirection) {
	// 				if (newLocation.piece.player !== this.gameService.savedTile.piece.player) {
	// 					data.moves.push([newx, newy, 0]);
	// 					// console.log(`${this.getNotation(newx, newy)} is a valid move`)
	// 				}
	// 			}
	// 		}
	// 			break;
	// 		case "queen": {
	// 			let a = newx >= oldx ? newx - oldx : oldx - newx;
	// 			let b = newy >= oldy ? newy - oldy : oldy - newy;

	// 			// literally just moves like bishop and rook
	// 			if (oldy === newy) {
	// 				// horizontal
	// 				correctDirection = true;
	// 				min = oldx < newx ? oldx + 1 : newx + 1;
	// 				max = oldx < newx ? newx - 1 : oldx - 1;
	// 				for (let c = min; c <= max; c++) {
	// 					if (this.boardService.findTile(c, oldy).piece.value !==
	// 						0
	// 					) {
	// 						pieceInTheWay = true;
	// 					}
	// 				}
	// 			} else if (oldx === newx) {
	// 				// console.log("x === x2");
	// 				// vertical
	// 				correctDirection = true;
	// 				min = oldy < newy ? oldy + 1 : newy + 1;
	// 				max = oldy < newy ? newy - 1 : oldy - 1;
	// 				for (let c = min; c <= max; c++) {
	// 					if (this.boardService.findTile(oldx, c).piece.value !==
	// 						0
	// 					) {
	// 						pieceInTheWay = true;
	// 					}
	// 				}
	// 			} else if (a === b) {
	// 				// console.log("a === b");
	// 				// diagonal
	// 				correctDirection = true;
	// 				// eg: if dir is positive, x axis goes up by 1 in the tile check
	// 				let dirx = newx > oldx ? 1 : -1;
	// 				let diry = newy > oldy ? 1 : -1;

	// 				for (let c = 1; c < a; c++) {
	// 					let tilex = oldx + c * dirx;
	// 					let tiley = oldy + c * diry;
	// 					if (this.boardService.findTile(tilex, tiley).piece
	// 						.value !== 0
	// 					) {
	// 						pieceInTheWay = true;
	// 					}
	// 				}
	// 			}

	// 			if (!pieceInTheWay && correctDirection) {
	// 				if (newLocation.piece.player !==
	// 					this.gameService.savedTile.piece.player
	// 				) {
	// 					data.moves.push([newx, newy, 0]);
	// 				}
	// 			}
	// 		}
	// 			break;
	// 	}

	// 	return data;
	// }

	// public validateMove(newLocation: Tile, checkingAvailableMoves: boolean): boolean {
	// 	let valid: boolean = false;
	// 	let data: ValidationData = this.defineValidationData(this.boardService.board[this.gameService.savedTile.piece.key], newLocation);
	// 	// this.log(newLocation.x, newLocation.y, "New location:")
	// 	// this.log(this.boardService.board[this.gameService.savedTile.piece.key].x, this.boardService.board[this.gameService.savedTile.piece.key].y, "piece from the board:")
	// 	let x = data.selectedLocation[0];
	// 	let y = data.selectedLocation[1];
	// 	let pV = data.pV;
	// 	// console.log("Validating tile:", this.getLetter(x)+(y+1))
	// 	// console.log(`displaying valid moves for ${this.getNotation(this.gameService.savedTile.x, this.gameService.savedTile.y)}`)
	// 	data.moves.forEach((move) => {
	// 		// console.log(`checking ${this.getNotation(move[0], move[1])}`)
	// 		if (this.boardService.board[newLocation.piece.key].piece.player !== this.currentPlayer) {

	// 			if (move[0] === x && move[1] === y) {
	// 				valid = true;
	// 				if (!checkingAvailableMoves) {
	// 					this.boardService.board.forEach((tile) => {
	// 						tile.enpassantable = false;
	// 					});

	// 					// if move was a double pawn move, and it's not just doing a move display
	// 					if (move[2] === 1) {
	// 						// aha! a sneaky double move... if only if there was a way to do something about this!!!!!!!
	// 						let doubleMovedPawn = this.boardService.findTile(x, y - 1 * pV);
	// 						doubleMovedPawn.enpassantable = true;
	// 					} else if (move[2] === 2) {
	// 						let victim = this.boardService.findTile(x, y - 1 * pV);
	// 						this.boardService.board[victim.key].piece = this.pieceService.createNullPiece(this.boardService.board[victim.piece.key].key);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	});
	// 	if (valid) {
	// 		this.log(x, y, "valid:")
	// 	} else {
	// 		// console.log(`${this.getNotation(x, y)} is NOT a valid move`)
	// 	}
	// 	return valid;
	// }







}
