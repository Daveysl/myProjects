import { Injectable } from "@angular/core";
import { PieceLogicService } from "../pieces/piece-logic.service";
import { Move } from "./moves.model";
import { Tile } from "../board/tile.model";
import { BoardService } from "../board/board.service";

@Injectable({
	providedIn: "root",
})
export class MovesService {
	
	private _currentPlayer: string;
	private _storedTile: Tile;
	private _step: string;	
	private _letters: string[];

	constructor(
		private pieceLogicService: PieceLogicService,
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
	public get storedTile() : Tile {
		return this._storedTile;
	}
	public set storedTile(value : Tile) {
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
	
	//  ----- Public Methods
	// get a letter from letters list
	public getLetter(value: number): string {
		return this.letters[value];
	}

	// initialize a move
	public initMove(): Move {
		return {
			turnNum: 0,
			piece: this.pieceLogicService.createNullPiece(null),
			capturing: false,
			past: [],
			new: [],
			notation: "",
			fenState: "",
			current: false,
		};
	}

	// create a new move
	public createMove(oldTile: Tile, newTile: Tile, capturing: boolean): Move {
		let move = this.initMove();
		move.piece = oldTile.piece;
		move.capturing = capturing;
		move.past = [oldTile.x, oldTile.y];
		move.new = [newTile.x, newTile.y];
		move.fenState = "";
		return move;
	}

	// create the notation for a move
	public createNotation(move: Move): string {
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
}
