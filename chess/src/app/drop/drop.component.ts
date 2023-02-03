import { Component } from "@angular/core";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Piece, Tile, ChessOptions, Castling, Move, Turn } from "./chess.model";

@Component({
	selector: "app-drop",
	templateUrl: "./drop.component.html",
	styleUrls: ["./drop.component.scss"],
})
export class DropComponent {
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
			abbr: "P",
			value: 1,
			player: "w",
		},
		{
			key: null,
			name: "bishop",
			abbr: "B",
			value: 2,
			player: "w",
		},
		{
			key: null,
			name: "knight",
			abbr: "N",
			value: 3,
			player: "w",
		},
		{
			key: null,
			name: "rook",
			abbr: "R",
			value: 4,
			player: "w",
		},
		{
			key: null,
			name: "king",
			abbr: "K",
			value: 5,
			player: "w",
		},
		{
			key: null,
			name: "queen",
			abbr: "Q",
			value: 6,
			player: "w",
		},
		{
			key: null,
			name: "pawn",
			abbr: "p",
			value: 7,
			player: "b",
		},
		{
			key: null,
			name: "bishop",
			abbr: "b",
			value: 8,
			player: "b",
		},
		{
			key: null,
			name: "knight",
			abbr: "n",
			value: 9,
			player: "b",
		},
		{
			key: null,
			name: "rook",
			abbr: "r",
			value: 10,
			player: "b",
		},
		{
			key: null,
			name: "queen",
			abbr: "q",
			value: 11,
			player: "b",
		},
		{
			key: null,
			name: "king",
			abbr: "k",
			value: 12,
			player: "b",
		},
	];
	// used in the options object
	public DEFAULT_FEN: string =
		"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	public DEFAULT_PIECESET: string = "cburnett";
	public DEFAULT_DISPLAY: string = "Piece Set";

	public DEFAULT_THEMES: string[] = [
		"theme1",
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
	public optionsList: string[] = ["Piece Set", "FEN"];

	public options: ChessOptions;

	public board: Tile[] = [];
	private boardState: number[];
	private letters: string[];

	private storedPiece: Piece;
	private castling: Castling;
	private currentPlayer: string;
	private stage: string;

	constructor() {
		this.initBoardState();
		this.initLetters();
		this.constructNewBoard();
		this.setDefaults();
	}

	// Setup Methods
	private constructNewBoard(): void {
		let darkTile = false;
		let i = 0;

		for (let y = 7; y >= 0; y--) {
			for (let x = 0; x < 8; x++) {
				let value = this.boardState[i];
				let defaultPiece = this.pieces.find(
					(piece) => piece.value === value
				);
				let key = i;

				if (x !== 0) {
					darkTile = !darkTile;
				}

				let piece: Piece = {
					key: key,
					name: defaultPiece.name,
					abbr: defaultPiece.abbr,
					value: defaultPiece.value,
					player: defaultPiece.player,
				};

				let tile: Tile = {
					key: key,
					piece: piece,
					color: darkTile,
					x: x,
					y: y,
					selected: false,
					enpassant: false,
					moveable: false,
				};

				this.board.push(tile);
				i++;
			}
		}
	}
	private setDefaults(): void {
		// Variables
		this.storedPiece = this.createNullPiece(null);
		this.currentPlayer = "w";
		this.stage = "piece";

		// Objects
		this.castling = {
			wlong: true,
			wshort: true,
			blong: true,
			bshort: true,
		};
		this.options = {
			pieceSet: this.DEFAULT_PIECESET,
			pieceSetList: this.DEFAULT_THEMES,
			fenValue: this.DEFAULT_FEN,
			display: this.DEFAULT_DISPLAY,
		};
		this.importFenValue(this.DEFAULT_FEN);
	}

	// Initialize Methods
	private initBoardState(): void {
		this.boardState = [
			10, 9, 8, 11, 12, 8, 9, 10, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 3, 2,
			6, 5, 2, 3, 4,
		];
	}
	private initLetters(): void {
		this.letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	}
	private initMove(): Move {
		return {
			piece: this.createNullPiece(null),
			capturing: false,
			past: [],
			new: [],
			notation: "",
			fenState: "",
		};
	}
	private createNullPiece(key: number) {
		return {
			key: key, // ID of tile
			name: "", // name of piece
			abbr: "", // abbreviation of name
			value: 0, // numeric ID of piece
			player: "", // name of player
		};
	}

	// Main Methods
	private selectPiece(tile: Tile): void {
		if (this.currentPlayer === tile.piece.player) {
			// console.log(`the turn is ${this.currentPlayer}'s and the selected piece belongs to ${tile.piece.player}`)
			this.storedPiece = tile.piece;
			tile.selected = true;
			this.stage = "location";
		}
	}
	private selectLocation(location: Tile): void {
		if (
			location.key !== this.storedPiece.key &&
			location.piece.player !== this.storedPiece.player
		) {
			if (this.validateMove(location)) {
				console.log("move is valid");
				this.movePiece(location, false);
			} else {
				console.log("This is not a valid move");
				this.storedPiece = this.createNullPiece(null);
				this.stage = "piece";
			}
		} else if (location.piece.player === this.storedPiece.player) {
			if (location.piece.key === this.storedPiece.key) {
        console.log("what")
				location.selected = false;
				this.stage = "piece";
			} else {
        console.log("what")
				this.selectPiece(location);
			}
		} else {
			console.log("this is not a valid location");
			this.storedPiece = this.createNullPiece(null);
			this.stage = "piece";
			if (location.key === this.storedPiece.key) {
				this.selectPiece(location);
			}
		}
	}
	private movePiece(location: Tile, castled: boolean): void {
		let piece = this.storedPiece;
		let capturing = location.piece.value !== 0 ? true : false;
		let move = this.createMove(this.board[piece.key], location, capturing);

		// change location's piece to selected piece
		this.board[location.key].piece = piece;
		// change selected piece's tile to empty
		this.board[piece.key].piece = this.createNullPiece(
			this.board[piece.key].key
		);
		// settle the piece into its new location
		location.piece.key = location.key;

		// record move
		this.updateFenValue();
		move.fenState = this.options.fenValue;
		move.notation = this.createNotation(move);

		// Clearup Loop ----------------------------------------------
		this.board.forEach((tile) => {
			// reset the moveable tile markers for each tile
			tile.moveable = false;
		});
		// erase the piece from storage
		this.storedPiece = this.createNullPiece(null);
		if (!castled) {
			this.currentPlayer = this.currentPlayer == "w" ? "b" : "w";
		}

		this.stage = "piece";
	}
	private castleAction(pY: number, rX: number, rX2: number): void {
		console.log("rX,rX2:" + rX, rX2);
		let saveTheStoredPiece = this.storedPiece;
		this.storedPiece = this.findTile(rX, pY).piece;
		this.movePiece(this.findTile(rX2, pY), true);
		this.storedPiece = saveTheStoredPiece;
	}

	private validateMove(newLocation: Tile): boolean {
		// DECLARE VARIABLES --------------------------------------------------------------
		let isValid: boolean = false; // is the move valid?
		let moves: number[][] = []; // possible moves

		let piece: Piece = this.storedPiece; // stored piece
		let pastLocation: Tile = this.board[this.storedPiece.key]; // tile on board
		let white: boolean = piece.player === "w" ? true : false; // is the piece white?

		let x: number = pastLocation.x; // old location row
		let y: number = pastLocation.y; // old location col

		let x2: number = newLocation.x; // new location row
		let y2: number = newLocation.y; // new location col

		// pawn
		// starting row 2 or 7 based on player
		let startrow: number = white ? 1 : 6;
		// playerValue turns number negative if piece is not white
		let playerValue: number = white ? 1 : -1;
		let pieceInTheWay = false;
		let min = 0;
		let max = 0;
		let valid = false;
		// PIECES -------------------------------------
		// picking a location to move
		switch (piece.name) {
			case "pawn":
				{
					// 1 - single move
					if (this.checkTile(x, y + 1 * playerValue)) {
						moves.push([x, y + 1 * playerValue]);

						// 2 - double move
						// must be previously unmoved (on its starting row)
						if (
							this.checkTile(x, y + 2 * playerValue) &&
							y === startrow
						) {
							moves.push([x, y + 2 * playerValue]);
						}
					}

					// 3 - capturing piece
					if (
						newLocation.piece.value !== 0 &&
						newLocation.piece.player !== this.storedPiece.player
					) {
						moves.push(
							[x + 1, y + 1 * playerValue],
							[x - 1, y + 1 * playerValue]
						);
					}

					// 4 - en passanting piece
					let victim = this.board.find(
						(tile) => tile.enpassant === true
					);
					if (victim) {
						this.board.forEach((tile) => {
							tile.enpassant = false;
						});

						if (victim.piece.player !== piece.player) {
							if (victim.y === y) {
								if (victim.x === x + 1) {
									moves.push([x + 1, y + 1 * playerValue]);
									victim.piece = victim.piece = this.createNullPiece(victim.key);
								} else if (victim.x === x - 1) {
									moves.push([x - 1, y + 1 * playerValue]);
									victim.piece = victim.piece = this.createNullPiece(victim.key);
								}
							}
						}
					}
				}
				break;
			case "knight":
				{
					moves.push(
						[x + 1, y + 2],
						[x - 1, y + 2],
						[x - 1, y - 2],
						[x + 1, y - 2],
						[x + 2, y + 1],
						[x - 2, y + 1],
						[x - 2, y - 1],
						[x + 2, y - 1]
					);
				}
				break;
			case "rook":
				{
					// have to see if a piece is in the way
					// 1. loop through each tile in the row away from piece until it reaches the board end
					// 2. if a tile has a piece and the piece is not the new location, flag
					// if y1 is the same as y2: horizontal (only x is changing)

					if (y === y2) {
						// horizontal
						console.log("horizontal");
						valid = true;
						min = x < x2 ? x + 1 : x2 + 1;
						max = x < x2 ? x2 - 1 : x - 1;
						console.log("max:" + max, "min:" + min);
						for (let c = min; c <= max; c++) {
							console.log(this.findLetter(c), y + 1);

							if (this.findTile(c, y).piece.value !== 0) {
								console.log("piece detected");
								pieceInTheWay = true;
							}
						}
					} else if (x === x2) {
						// vertical
						console.log("vertical");
						valid = true;
						min = y < y2 ? y + 1 : y2 + 1;
						max = y < y2 ? y2 - 1 : y - 1;
						console.log("max:" + max, "min:" + min);
						for (let c = min; c <= max; c++) {
							console.log(this.findLetter(x), c + 1);

							if (this.findTile(x, c).piece.value !== 0) {
								console.log("piece detected");
								pieceInTheWay = true;
							}
						}
					}

					if (!pieceInTheWay && valid) {
						if (
							newLocation.piece.player !== this.storedPiece.player
						) {
							moves.push([x2, y2]);

							// castling functionality
							if (piece.player === "w") {
								if (y === 0) {
									if (x === 0 && this.castling.wlong) {
										console.log(
											"white can no longer castle long."
										);
										this.castling.wlong = false;
									} else if (
										x === 7 &&
										this.castling.wshort
									) {
										console.log(
											"white can no longer castle short."
										);
										this.castling.wshort = false;
									}
								}
							} else {
								if (y === 7) {
									if (x === 0 && this.castling.blong) {
										console.log(
											"black can no longer castle long."
										);
										this.castling.blong = false;
									} else if (
										x === 7 &&
										this.castling.bshort
									) {
										console.log(
											"black can no longer castle short."
										);
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
					moves.push(
						[x + 1, y + 1],
						[x - 1, y + 1],
						[x + 1, y - 1],
						[x - 1, y - 1],
						[x + 1, y],
						[x - 1, y],
						[x, y + 1],
						[x, y - 1]
					);

					// add castling moves
					let pY = 0; // player Y coord
					let cD = ""; // castling Direction

					if (piece.player === "w") {
						pY = 0;
						if (x2 === 6 && this.castling.wshort) {
							cD = "short";
						} else if (x2 === 2 && this.castling.wlong) {
							cD = "long";
						}
					} else if (piece.player === "b") {
						pY = 7;
						if (x2 === 6 && this.castling.bshort) {
							cD = "short";
						} else if (x2 === 2 && this.castling.blong) {
							cD = "long";
						}
					}

					if (
						this.findTile(5, pY).piece.value === 0 &&
						this.findTile(6, pY).piece.value === 0 &&
						cD === "short"
					) {
						moves.push([x + 2, y]);
						this.castleAction(pY, 7, 5);
					} else if (
						this.findTile(2, pY).piece.value === 0 &&
						this.findTile(3, pY).piece.value === 0 &&
						cD === "long"
					) {
						moves.push([x - 2, y]);
						this.castleAction(pY, 0, 3);
					}

					// break castle function if king moves
					if (x === 4) {
						if (piece.player === "w" && y === 0) {
							console.log("white can no longer castle.");
							this.castling.wlong = false;
							this.castling.wshort = false;
						} else if (piece.player === "b" && y === 7) {
							console.log("black can no longer castle.");
							this.castling.blong = false;
							this.castling.bshort = false;
						}
					}
				}
				break;
			case "bishop":
				{
					let a = x2 >= x ? x2 - x : x - x2;
					let b = y2 >= y ? y2 - y : y - y2;

					if (a === b) {
						valid = true;
						// eg: if dir is positive, x axis goes up by 1 in the tile check
						let dirx = x2 > x ? 1 : -1;
						let diry = y2 > y ? 1 : -1;

						for (let c = 1; c < a; c++) {
							let tilex = x + c * dirx;
							let tiley = y + c * diry;
							if (this.findTile(tilex, tiley).piece.value !== 0) {
								pieceInTheWay = true;
								console.log(
									`piece on ${tilex},${tiley} is in the way!`
								);
							}
						}
					}

					if (!pieceInTheWay && valid) {
						if (
							newLocation.piece.player !== this.storedPiece.player
						) {
							moves.push([x2, y2]);
						}
					}
				}
				break;
			case "queen":
				{
					let a = x2 >= x ? x2 - x : x - x2;
					let b = y2 >= y ? y2 - y : y - y2;

					// literally just moves like bishop and rook
					if (y === y2) {
						// horizontal
						console.log("moving horizontal");
						valid = true;
						min = x < x2 ? x + 1 : x2 + 1;
						max = x < x2 ? x2 - 1 : x - 1;
						for (let c = min; c <= max; c++) {
							console.log(this.findLetter(c), y);
							if (this.findTile(c, y).piece.value !== 0) {
								console.log(
									`piece on ${c},${y} is in the way!`
								);
								pieceInTheWay = true;
							}
						}
					} else if (x === x2) {
						// vertical
						console.log("moving vertical");
						valid = true;
						min = y < y2 ? y + 1 : y2 + 1;
						max = y < y2 ? y2 - 1 : y - 1;
						for (let c = min; c <= max; c++) {
							console.log(this.findLetter(x), c);
							if (this.findTile(x, c).piece.value !== 0) {
								console.log(
									`piece on ${x},${c} is in the way!`
								);
								pieceInTheWay = true;
							}
						}
					} else if (a === b) {
						console.log("moving diagonally");
						valid = true;
						// eg: if dir is positive, x axis goes up by 1 in the tile check
						let dirx = x2 > x ? 1 : -1;
						let diry = y2 > y ? 1 : -1;

						for (let c = 1; c < a; c++) {
							let tilex = x + c * dirx;
							let tiley = y + c * diry;
							if (this.findTile(tilex, tiley).piece.value !== 0) {
								pieceInTheWay = true;
								console.log(
									`piece on ${tilex},${tiley} is in the way!`
								);
							}
						}
					}

					if (!pieceInTheWay && valid) {
						if (
							newLocation.piece.player !== this.storedPiece.player
						) {
							moves.push([x2, y2]);
						}
					}
				}
				break;
		}
		/**
		 * Moves Loop
		 * go through each possible move and see if the new location matches
		 * console.log(moves);
		 */

		moves.forEach((move) => {
			// console.log(this.getLetter(move[0]) + (move[1]+1));

			// EN PASSANT - if a pawn completed a special 2 move , temporarily declare it as enpassantable to possible attackers
			// - reusing a pawn variable to turn negative or positive based on player
			if (
				y2 === y + 2 * playerValue &&
				!newLocation.enpassant &&
				piece.name === "pawn"
			) {
				console.log(this.findLetter(x2) + (y2 + 1), "is enpassantable");
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
	private checkTile(x: number, y: number): boolean {
		// Used to check if a tile is empty, or if there is a piece that the opposing player owns
		let valid = false;
		// if the tile has a piece in it, it is not valid.
		let tile = this.findTile(x, y);
		if (
			tile.piece.value === 0 &&
			tile.piece.player !== this.storedPiece.player
		) {
			valid = true;
		}

		return valid;
	}

	// Search Methods
	private findAbbr(value: number): string {
		return this.pieces[value].abbr;
	}
	private findTile(x: number, y: number): Tile {
		return this.board.find((tile) => tile.x === x && tile.y === y);
	}
	private findLetter(x: number): string {
		return this.letters[x];
	}
	private findPieceFromChar(char: string, key: number): Piece {
		// console.log(char)
		// console.log(this.pieces.find(piece => piece.abbr == char))
		let piece = this.pieces.find((piece) => piece.abbr == char);
		// console.log(piece);
		// return this.pieces.find(piece => {piece.abbr == char})
		return piece;
		// return piece;
	}

	// Recording
	private createMove(oldTile: Tile, newTile: Tile, capturing: boolean): Move {
		let move = this.initMove();
		move.piece = oldTile.piece;
		move.capturing = capturing;
		move.past = [oldTile.x, oldTile.y];
		move.new = [newTile.x, newTile.y];
		move.fenState = "";
		return move;
	}
	private createNotation(move: Move): string {
		let note: string = "";
		let pieceAbbr: string = move.piece.abbr.toUpperCase();

		let pastCoord: string =
			this.findLetter(move.past[0]) + (move.past[1] + 1);
		let newCoord: string = this.findLetter(move.new[0]) + (move.new[1] + 1);

		if (move.capturing) {
			pieceAbbr = pieceAbbr === "P" ? pastCoord : pieceAbbr;
			note = pieceAbbr[0] + "x" + newCoord;
		} else {
			note = pieceAbbr === "P" ? newCoord : pieceAbbr + newCoord;
		}

		console.log("note", note);
		return note;
	}
	private updateFenValue(): void {
		let string: string = "";
		let rowID: number = 0;
		let spaces = 0;

		this.board.forEach((tile) => {
			let data = tile.piece.value;
			if (data !== 0) {
				string = spaces != 0 ? (string += spaces) : string;
				spaces = 0;
				string += this.findAbbr(data);
			} else {
				spaces++;
			}
			if (rowID === 7) {
				rowID = 0;
				string = spaces != 0 ? (string += spaces) : string;
				string += "/";
				spaces = 0;
			} else {
				rowID++;
			}
		});
		this.options.fenValue = string.slice(0, -1) + " w KQkq - 0 1";
	}
	private importFenValue(fen: string): void {
		let fenArray: string[] = [];

		fen.split("/").forEach((row, i) => {
			// console.log(row);
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
		for (let i = 0; i < 64; i++) {
			let newPiece = this.findPieceFromChar(fenArray[i], i);
			this.board[i].piece.abbr = newPiece.abbr;
			this.board[i].piece.name = newPiece.name;
			this.board[i].piece.player = newPiece.player;
			this.board[i].piece.value = newPiece.value;
		}
	}
	private validateFenValue(fen: string): boolean {
		let flag = false;
		/** Test Cases:
		 * 1. Fen must have length of 8 sections seperated by '/', then a 9th one containing Fen metadata.
		 * 2. Each section can only contain letters 'pnbrqk or PNBRQK or empty'
		 * 3. Each section must be 8 characters long
		 *
		 */

		if (fen.split("/").length !== 8) {
			flag = true;
		}
		return !flag;
	}

	// Event Listeners
	public onFenValueChange(value: string): void {
		if (this.validateFenValue(value)) {
			console.log(value);

			this.importFenValue(value);
			this.options.fenValue = value;
		}
	}
	public pieceClicked(key: number): void {
		// INIT
		let tile = this.board.find((tile) => tile.key === key);
		this.board.forEach((tile) => {
			tile.selected = false;
			tile.moveable = false;
		});
		console.log("tile:", this.findLetter(tile.x) + (tile.y + 1));
		/*
      STAGES:
      1. Select piece
      2. Error check
      3. Select Location
      4. Error check
      5. Remove past piece and insert into location
      6. Change turn to other player
    
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

	public pieceDropped(event: CdkDragDrop<Tile>) {
		console.log(event.container);
		console.log(event.item);
		
    	this.selectPiece(event.previousContainer.data);
    	this.selectLocation(event.container.data);
    	// this.movePiece(event.container.data, false);
	}
}
