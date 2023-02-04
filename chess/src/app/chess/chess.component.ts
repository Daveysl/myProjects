/**
 * Made by Sam Davey
 *
 *
 */

import { Component } from "@angular/core";
import {ValidationData } from "./chess.model";
import { Tile } from "./logic/board/tile.model"
import { Piece } from "./logic/pieces/piece.model"
import { Move, Turn, Castling } from "./logic/moves/moves.model"
import { ChessOptions } from "./models/options.model"

import { CdkDrag } from "@angular/cdk/drag-drop";

@Component({
	selector: "app-chess",
	templateUrl: "./chess.component.html",
	styleUrls: ["./chess.component.scss"],
})
export class ChessComponent {
	// List of each chess piece
	// first space (0) used for blank or null space
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


	// FEN notation string, used for recording positions 
	public DEFAULT_FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	//  default theme set name for pieces
	public DEFAULT_PIECESET: string = "cburnett";
	//  default option displayed
	public DEFAULT_DISPLAY: string = "Piece Set";
	// list of themes available
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
	// expandable list of options
	public optionsList: string[] = ["Piece Set", "FEN"];
	//  object for options
	public options: ChessOptions;

	
	// adjustable board length
	public boardSize: number;
	// recorded mouse location (currently unused)
	public mouseLoc: number[];
	
	// board initiated
	public board: Tile[] = [];
	// list of coordinate letters
	private letters: string[];
	
	// tile that was selected last
	private storedTile: Tile;
	// the current turn
	public currentPlayer: string;
	
	// object to check if castle move is legal
	private castling: Castling;

	// check if selecting a piece or moving to a location
	private step: string;
	
	// list of past moves 
	private turnHistory: Turn[];

	constructor() {
		this.initBoard();
		this.initLetters();
		this.setDefaults();
	}

	// Setup Methods
	private setDefaults(): void {
		// Variables
		this.storedTile = this.createNullTile(null);
		this.currentPlayer = "w";
		this.step = "piece";
		this.boardSize = 500;

		// Arrays
		this.turnHistory = [];

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

	// Initialize Methods ---------------------------------------------------------------------------------------
	// initialize the board 
	private initBoard(): void {
		// created a board based on a past board generation loop
		this.board = [
		{key:0,piece:{key:0,name:"rook",abbr:"r",value:10,player:"b",},color:false,x:0,y:7,selected:false,enpassantable:false,moveable:false},
		{key:1,piece:{key:1,name:"knight",abbr:"n",value:9,player:"b",},color:true,x:1,y:7,selected:false,enpassantable:false,moveable:false},
		{key:2,piece:{key:2,name:"bishop",abbr:"b",value:8,player:"b",},color:false,x:2,y:7,selected:false,enpassantable:false,moveable:false},
		{key:3,piece:{key:3,name:"queen",abbr:"q",value:11,player:"b",},color:true,x:3,y:7,selected:false,enpassantable:false,moveable:false},
		{key:4,piece:{key:4,name:"king",abbr:"k",value:12,player:"b",},color:false,x:4,y:7,selected:false,enpassantable:false,moveable:false},
		{key:5,piece:{key:5,name:"bishop",abbr:"b",value:8,player:"b",},color:true,x:5,y:7,selected:false,enpassantable:false,moveable:false},
		{key:6,piece:{key:6,name:"knight",abbr:"n",value:9,player:"b",},color:false,x:6,y:7,selected:false,enpassantable:false,moveable:false},
		{key:7,piece:{key:7,name:"rook",abbr:"r",value:10,player:"b",},color:true,x:7,y:7,selected:false,enpassantable:false,moveable:false},
		{key:8,piece:{key:8,name:"pawn",abbr:"p",value:7,player:"b",},color:true,x:0,y:6,selected:false,enpassantable:false,moveable:false},
		{key:9,piece:{key:9,name:"pawn",abbr:"p",value:7,player:"b",},color:false,x:1,y:6,selected:false,enpassantable:false,moveable:false},
		{key:10,piece:{key:10,name:"pawn",abbr:"p",value:7,player:"b",},color:true,x:2,y:6,selected:false,enpassantable:false,moveable:false},
		{key:11,piece:{key:11,name:"pawn",abbr:"p",value:7,player:"b",},color:false,x:3,y:6,selected:false,enpassantable:false,moveable:false},
		{key:12,piece:{key:12,name:"pawn",abbr:"p",value:7,player:"b",},color:true,x:4,y:6,selected:false,enpassantable:false,moveable:false},
		{key:13,piece:{key:13,name:"pawn",abbr:"p",value:7,player:"b",},color:false,x:5,y:6,selected:false,enpassantable:false,moveable:false},
		{key:14,piece:{key:14,name:"pawn",abbr:"p",value:7,player:"b",},color:true,x:6,y:6,selected:false,enpassantable:false,moveable:false},
		{key:15,piece:{key:15,name:"pawn",abbr:"p",value:7,player:"b",},color:false,x:7,y:6,selected:false,enpassantable:false,moveable:false},
		{key:16,piece:{key:16,name:"",abbr:"",value:0,player:"",},color:false,x:0,y:5,selected:false,enpassantable:false,moveable:false},
		{key:17,piece:{key:17,name:"",abbr:"",value:0,player:"",},color:true,x:1,y:5,selected:false,enpassantable:false,moveable:false},
		{key:18,piece:{key:18,name:"",abbr:"",value:0,player:"",},color:false,x:2,y:5,selected:false,enpassantable:false,moveable:false},
		{key:19,piece:{key:19,name:"",abbr:"",value:0,player:"",},color:true,x:3,y:5,selected:false,enpassantable:false,moveable:false},
		{key:20,piece:{key:20,name:"",abbr:"",value:0,player:"",},color:false,x:4,y:5,selected:false,enpassantable:false,moveable:false},
		{key:21,piece:{key:21,name:"",abbr:"",value:0,player:"",},color:true,x:5,y:5,selected:false,enpassantable:false,moveable:false},
		{key:22,piece:{key:22,name:"",abbr:"",value:0,player:"",},color:false,x:6,y:5,selected:false,enpassantable:false,moveable:false},
		{key:23,piece:{key:23,name:"",abbr:"",value:0,player:"",},color:true,x:7,y:5,selected:false,enpassantable:false,moveable:false},
		{key:24,piece:{key:24,name:"",abbr:"",value:0,player:"",},color:true,x:0,y:4,selected:false,enpassantable:false,moveable:false},
		{key:25,piece:{key:25,name:"",abbr:"",value:0,player:"",},color:false,x:1,y:4,selected:false,enpassantable:false,moveable:false},
		{key:26,piece:{key:26,name:"",abbr:"",value:0,player:"",},color:true,x:2,y:4,selected:false,enpassantable:false,moveable:false},
		{key:27,piece:{key:27,name:"",abbr:"",value:0,player:"",},color:false,x:3,y:4,selected:false,enpassantable:false,moveable:false},
		{key:28,piece:{key:28,name:"",abbr:"",value:0,player:"",},color:true,x:4,y:4,selected:false,enpassantable:false,moveable:false},
		{key:29,piece:{key:29,name:"",abbr:"",value:0,player:"",},color:false,x:5,y:4,selected:false,enpassantable:false,moveable:false},
		{key:30,piece:{key:30,name:"",abbr:"",value:0,player:"",},color:true,x:6,y:4,selected:false,enpassantable:false,moveable:false},
		{key:31,piece:{key:31,name:"",abbr:"",value:0,player:"",},color:false,x:7,y:4,selected:false,enpassantable:false,moveable:false},
		{key:32,piece:{key:32,name:"",abbr:"",value:0,player:"",},color:false,x:0,y:3,selected:false,enpassantable:false,moveable:false},
		{key:33,piece:{key:33,name:"",abbr:"",value:0,player:"",},color:true,x:1,y:3,selected:false,enpassantable:false,moveable:false},
		{key:34,piece:{key:34,name:"",abbr:"",value:0,player:"",},color:false,x:2,y:3,selected:false,enpassantable:false,moveable:false},
		{key:35,piece:{key:35,name:"",abbr:"",value:0,player:"",},color:true,x:3,y:3,selected:false,enpassantable:false,moveable:false},
		{key:36,piece:{key:36,name:"",abbr:"",value:0,player:"",},color:false,x:4,y:3,selected:false,enpassantable:false,moveable:false},
		{key:37,piece:{key:37,name:"",abbr:"",value:0,player:"",},color:true,x:5,y:3,selected:false,enpassantable:false,moveable:false},
		{key:38,piece:{key:38,name:"",abbr:"",value:0,player:"",},color:false,x:6,y:3,selected:false,enpassantable:false,moveable:false},
		{key:39,piece:{key:39,name:"",abbr:"",value:0,player:"",},color:true,x:7,y:3,selected:false,enpassantable:false,moveable:false},
		{key:40,piece:{key:40,name:"",abbr:"",value:0,player:"",},color:true,x:0,y:2,selected:false,enpassantable:false,moveable:false},
		{key:41,piece:{key:41,name:"",abbr:"",value:0,player:"",},color:false,x:1,y:2,selected:false,enpassantable:false,moveable:false},
		{key:42,piece:{key:42,name:"",abbr:"",value:0,player:"",},color:true,x:2,y:2,selected:false,enpassantable:false,moveable:false},
		{key:43,piece:{key:43,name:"",abbr:"",value:0,player:"",},color:false,x:3,y:2,selected:false,enpassantable:false,moveable:false},
		{key:44,piece:{key:44,name:"",abbr:"",value:0,player:"",},color:true,x:4,y:2,selected:false,enpassantable:false,moveable:false},
		{key:45,piece:{key:45,name:"",abbr:"",value:0,player:"",},color:false,x:5,y:2,selected:false,enpassantable:false,moveable:false},
		{key:46,piece:{key:46,name:"",abbr:"",value:0,player:"",},color:true,x:6,y:2,selected:false,enpassantable:false,moveable:false},
		{key:47,piece:{key:47,name:"",abbr:"",value:0,player:"",},color:false,x:7,y:2,selected:false,enpassantable:false,moveable:false},
		{key:48,piece:{key:48,name:"pawn",abbr:"P",value:1,player:"w",},color:false,x:0,y:1,selected:false,enpassantable:false,moveable:false},
		{key:49,piece:{key:49,name:"pawn",abbr:"P",value:1,player:"w",},color:true,x:1,y:1,selected:false,enpassantable:false,moveable:false},
		{key:50,piece:{key:50,name:"pawn",abbr:"P",value:1,player:"w",},color:false,x:2,y:1,selected:false,enpassantable:false,moveable:false},
		{key:51,piece:{key:51,name:"pawn",abbr:"P",value:1,player:"w",},color:true,x:3,y:1,selected:false,enpassantable:false,moveable:false},
		{key:52,piece:{key:52,name:"pawn",abbr:"P",value:1,player:"w",},color:false,x:4,y:1,selected:false,enpassantable:false,moveable:false},
		{key:53,piece:{key:53,name:"pawn",abbr:"P",value:1,player:"w",},color:true,x:5,y:1,selected:false,enpassantable:false,moveable:false},
		{key:54,piece:{key:54,name:"pawn",abbr:"P",value:1,player:"w",},color:false,x:6,y:1,selected:false,enpassantable:false,moveable:false},
		{key:55,piece:{key:55,name:"pawn",abbr:"P",value:1,player:"w",},color:true,x:7,y:1,selected:false,enpassantable:false,moveable:false},
		{key:56,piece:{key:56,name:"rook",abbr:"R",value:4,player:"w",},color:true,x:0,y:0,selected:false,enpassantable:false,moveable:false},
		{key:57,piece:{key:57,name:"knight",abbr:"N",value:3,player:"w",},color:false,x:1,y:0,selected:false,enpassantable:false,moveable:false},
		{key:58,piece:{key:58,name:"bishop",abbr:"B",value:2,player:"w",},color:true,x:2,y:0,selected:false,enpassantable:false,moveable:false},
		{key:59,piece:{key:59,name:"queen",abbr:"Q",value:6,player:"w",},color:false,x:3,y:0,selected:false,enpassantable:false,moveable:false},
		{key:60,piece:{key:60,name:"king",abbr:"K",value:5,player:"w",},color:true,x:4,y:0,selected:false,enpassantable:false,moveable:false},
		{key:61,piece:{key:61,name:"bishop",abbr:"B",value:2,player:"w",},color:false,x:5,y:0,selected:false,enpassantable:false,moveable:false},
		{key:62,piece:{key:62,name:"knight",abbr:"N",value:3,player:"w",},color:true,x:6,y:0,selected:false,enpassantable:false,moveable:false},
		{key:63,piece:{key:63,name:"rook",abbr:"R",value:4,player:"w",},color:false,x:7,y:0,selected:false,enpassantable:false,moveable:false}
	];
	}
	// create list of letters for coordinates
	private initLetters(): void {
		this.letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	}
	// create a new Move object
	private initMove(): Move {
		return {
			turnNum: 0,
			piece: this.createNullPiece(null),
			capturing: false,
			past: [],
			new: [],
			notation: "",
			fenState: "",
			current: false,
		};
	}
	// create a new Turn object
	private createNewTurn(): Turn {
		return {
			num: this.turnHistory.length + 1,
			white: this.initMove(),
			black: this.initMove(),
		};
	}
	// create an empty or default piece
	private createNullPiece(key: number) {
		return {
			key: key, // ID of tile
			name: "", // name of piece
			abbr: "", // abbreviation of name
			value: 0, // numeric ID of piece
			player: "", // name of player
			
		};
	}q
	// create an empty or default tile
	private createNullTile(key: number) {
		return {
			key: key,
			piece: this.createNullPiece(null),
			color: false,
			x: 0,
			y: 0,
			selected: false,
			enpassantable: false,
			moveable: false,
		}
	}

	// Main Methods
	private selectTile(tile: Tile): void {
		if (this.currentPlayer === tile.piece.player) {
			this.storedTile.piece = tile.piece;
			tile.selected = true;
			this.step = "location";
			this.displayMoveableTiles();
		}
	}

	private selectLocation(location: Tile): void {
		if (location.key !== this.storedTile.piece.key && location.piece.player !== this.storedTile.piece.player) {
			if (this.validateMove(location, false)) {
				console.log("move is valid");
				this.movePiece(location, 1);
			} else {
				console.log("This is not a valid move");
				this.storedTile.piece = this.createNullPiece(null);
				this.step = "piece";
			}
		} else if (location.piece.player === this.storedTile.piece.player) {
			if (location.piece.key === this.storedTile.piece.key) {
				location.selected = false;
				this.step = "piece";
			} else {
				this.selectTile(location);
			}
		} else {
			console.log("this is not a valid location");
			this.storedTile.piece = this.createNullPiece(null);
			this.step = "piece";
			if (location.key === this.storedTile.piece.key) {
				this.selectTile(location);
			}
		}
	}
	private movePiece(location: Tile, code: number): void {
		let piece = this.storedTile.piece;
		let capturing = location.piece.value !== 0 ? true : false;
		if (code === 3) {
			capturing = true;
		}
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
		this.turnHistory.forEach((turn) => {
			turn.white.current = false;
			turn.black.current = false;
		});
		move.fenState = this.options.fenValue;
		move.notation = this.createNotation(move);
		move.current = true;
		this.setTurn(move);

		// Clearup Loop ----------------------------------------------
		this.board.forEach((tile) => {
			// reset the moveable tile markers for each tile
			tile.moveable = false;
		});
		// erase the piece from storage
		this.storedTile.piece = this.createNullPiece(null);
		if (code !== 2) {
			this.currentPlayer = this.currentPlayer == "w" ? "b" : "w";
		}

		this.step = "piece";
	}
	private defineValidationData(pastLocation: Tile, newLocation: Tile): ValidationData {
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
					pawnMoveTile = this.findTile(x, y+1*playerValue);
					if (pawnMoveTile.piece.value === 0 && pawnMoveTile.piece.player !== this.storedTile.piece.player) {
						data.moves.push([x, y + 1 * playerValue, 0]);

						// 2 - double move
						// must be previously unmoved (on its starting row)
						pawnMoveTile = this.findTile(x,y + 2 * playerValue);
						if (pawnMoveTile.piece.value === 0 && pawnMoveTile.piece.player !== this.storedTile.piece.player&& y === startrow) {
							data.moves.push([x,y + 2 * playerValue,1,]);
						}
					}

					// 3 - capturing Piece
					if (newLocation.piece.value !== 0 && newLocation.piece.player !== this.storedTile.piece.player) {
						data.moves.push([x + 1, y + 1 * playerValue, 0],[x - 1, y + 1 * playerValue, 0]);
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
							newLocation.piece.player !== this.storedTile.piece.player
						) {
							data.moves.push([x2, y2, 0]);

							// castling functionality
							if (this.storedTile.piece.player === "w") {
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

					// add castling moves
					let pY = 0; // player Y coord
					let cD = ""; // castling Direction

					if (this.storedTile.piece.player === "w") {
						pY = 0;
						if (x2 === 6 && this.castling.wshort) {
							cD = "short";
						} else if (x2 === 2 && this.castling.wlong) {
							cD = "long";
						}
					} else if (this.storedTile.piece.player === "b") {
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

					// break castle function if king moves
					if (x === 4) {
						if (this.storedTile.piece.player === "w" && y === 0) {
							console.log("white can no longer castle.");
							this.castling.wlong = false;
							this.castling.wshort = false;
						} else if (
							this.storedTile.piece.player === "b" &&
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

					// literally just data.moves like bishop and rook
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
							newLocation.piece.player !== this.storedTile.piece.player
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
			this.board[this.storedTile.piece.key],
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
							let doubleMovedPawn = this.findTile(data.x2, data.y2 - 1*data.pV);
							doubleMovedPawn.enpassantable = true;
						} else if (move[2] === 2) {
							let victim = this.findTile(data.x2, data.y2 - 1*data.pV);
							this.board[victim.key].piece = this.createNullPiece(this.board[victim.piece.key].key);
						}
					}
				}
			}
		});

		return valid;
	}

	private castleAction(pY: number, rX: number, rX2: number): void {
		console.log("rX,rX2:" + rX, rX2);
		let saveTheStoredPiece = this.storedTile.piece;
		this.storedTile.piece = this.findTile(rX, pY).piece;
		this.movePiece(this.findTile(rX2, pY), 2);
		this.storedTile.piece = saveTheStoredPiece;
	}

	private displayMoveableTiles(): void {
		this.board.forEach((tile) => {
			if (this.validateMove(tile, true)) {
				tile.moveable = true;
			}
		});
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
	private findPieceFromChar(char: string): Piece {
		let piece = this.pieces.find((piece) => piece.abbr == char);
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
		return note;
	}
	private setTurn(move: Move): void {
		// console.log("move: ", move.current)
		let turn =
			this.currentPlayer === "w"
				? this.createNewTurn()
				: this.turnHistory[this.turnHistory.length - 1];

		if (this.currentPlayer === "w") {
			turn.white = move;
			turn.white.turnNum = turn.num;
			this.turnHistory.push(turn);
			// console.log(this.turnHistory);
		} else {
			turn.black = move;
			turn.black.turnNum = turn.num;
			// console.log(this.turnHistory);
		}
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
			let newPiece = this.findPieceFromChar(fenArray[i]);
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
		 */

		if (fen.split("/").length !== 8) {
			flag = true;
		}
		return !flag;
	}

	// Event Listeners
	public onFenValueChange(value: string): void {
		if (this.validateFenValue(value)) {
			// console.log(value);

			this.importFenValue(value);
			this.options.fenValue = value;
		}
	}
	public pieceClicked(event: MouseEvent, key: number): void {
		this.mouseLoc = [event.clientX, event.clientY]
		// console.log(this.mouseLoc);
		
		// INIT
		let tile = this.board.find((tile) => tile.key === key);
		this.board.forEach((tile) => {
			tile.selected = false;
			tile.moveable = false;
		});

		console.log("tile:", this.findLetter(tile.x) + (tile.y + 1));
		
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
					console.log(tile.piece.key, this.storedTile.piece.key)
					
					if (tile.piece.key !== this.storedTile.piece.key){
						this.selectTile(tile);

					} else {
						this.step = "piece";
					}
					
				}
				// else if (tile.piece.player === this.currentPlayer && tile.key !== this.storedTile.key) {
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
	public changeSet(theme: string): void {
		this.options.pieceSet = theme;
		console.log("theme is", theme);
	}
	public openTab(tab: string) {
		this.options.display = tab;
	}
	public getPast(move: Move) {
		this.turnHistory.forEach((turn) => {
			turn.white.current = false;
			turn.black.current = false;
		});
		console.log(move.fenState);
		this.options.fenValue = move.fenState;
		this.importFenValue(move.fenState);

		if (move.piece.player === "w") {
			this.turnHistory[move.turnNum - 1].white.current = true;
			this.currentPlayer = "b";
			this.turnHistory.splice(move.turnNum);
			this.turnHistory[move.turnNum - 1].black = this.initMove();
		} else {
			this.turnHistory[move.turnNum - 1].black.current = true;
			this.currentPlayer = "w";
			this.turnHistory.splice(move.turnNum);
		}
	}

	public piecePickedUp(event: CdkDrag<Tile>, tile: Tile) {
  		console.log(tile);
		// if (this.storedTile.piece.player === this.currentPlayer) {
			console.log("piece picked up:", tile.piece.name, event);
			this.selectTile(tile);
		// }
	}
	public pieceDropped(tile: Tile) {
		if (this.storedTile.piece.player !== "" && this.storedTile.piece.player !== tile.piece.player) {
			this.selectLocation(tile);
		} else {
			console.log("oops");
		}
	}
} // ENDING BRACE
