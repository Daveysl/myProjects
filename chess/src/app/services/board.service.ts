import { Injectable } from '@angular/core';
import { Castling } from '../models/moves.model';
import { PieceLogicService } from './piece-logic.service';
import { Tile } from '../models/tile.model';
import { ChessOptions } from '../models/options.model';


@Injectable({
	providedIn: 'root'
})
export class BoardService {
	private _castling: Castling;
	private _board: Tile[]
	private _fenValue: string;
	private _letters: string[];

	constructor (
		private pieceService: PieceLogicService
	) {
		this._letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
	}

	// ----- Gets and Sets
	// value to record if castling has been done on the board
	public get castling(): Castling {
		return this._castling;
	}
	public set castling(value: Castling) {
		this._castling = value;
	}
	// board state
	public get board(): Tile[] {
		return this._board;
	}
	public set board(value: Tile[]) {
		this._board = value;
	}
	// fen value
	get fenValue() {
		return this._fenValue;
	}
	set fenValue(value: string) {
		this._fenValue = value;
	}
	get letters(): string[] {
		return this._letters;
	}
	set letters(value: string[]) {
		this._letters = value;
	}

	// initialize the board 
	public initBoard(): void {
		// created a board based on a past board generation loop
		this.board = [
			{ key: 0, piece: { key: 0, name: "rook", abbr: "r", value: 10, player: "b", }, color: false, x: 0, y: 7, selected: false, enpassantable: false, moveable: false },
			{ key: 1, piece: { key: 1, name: "knight", abbr: "n", value: 9, player: "b", }, color: true, x: 1, y: 7, selected: false, enpassantable: false, moveable: false },
			{ key: 2, piece: { key: 2, name: "bishop", abbr: "b", value: 8, player: "b", }, color: false, x: 2, y: 7, selected: false, enpassantable: false, moveable: false },
			{ key: 3, piece: { key: 3, name: "queen", abbr: "q", value: 11, player: "b", }, color: true, x: 3, y: 7, selected: false, enpassantable: false, moveable: false },
			{ key: 4, piece: { key: 4, name: "king", abbr: "k", value: 12, player: "b", }, color: false, x: 4, y: 7, selected: false, enpassantable: false, moveable: false },
			{ key: 5, piece: { key: 5, name: "bishop", abbr: "b", value: 8, player: "b", }, color: true, x: 5, y: 7, selected: false, enpassantable: false, moveable: false },
			{ key: 6, piece: { key: 6, name: "knight", abbr: "n", value: 9, player: "b", }, color: false, x: 6, y: 7, selected: false, enpassantable: false, moveable: false },
			{ key: 7, piece: { key: 7, name: "rook", abbr: "r", value: 10, player: "b", }, color: true, x: 7, y: 7, selected: false, enpassantable: false, moveable: false },
			{ key: 8, piece: { key: 8, name: "pawn", abbr: "p", value: 7, player: "b", }, color: true, x: 0, y: 6, selected: false, enpassantable: false, moveable: false },
			{ key: 9, piece: { key: 9, name: "pawn", abbr: "p", value: 7, player: "b", }, color: false, x: 1, y: 6, selected: false, enpassantable: false, moveable: false },
			{ key: 10, piece: { key: 10, name: "pawn", abbr: "p", value: 7, player: "b", }, color: true, x: 2, y: 6, selected: false, enpassantable: false, moveable: false },
			{ key: 11, piece: { key: 11, name: "pawn", abbr: "p", value: 7, player: "b", }, color: false, x: 3, y: 6, selected: false, enpassantable: false, moveable: false },
			{ key: 12, piece: { key: 12, name: "pawn", abbr: "p", value: 7, player: "b", }, color: true, x: 4, y: 6, selected: false, enpassantable: false, moveable: false },
			{ key: 13, piece: { key: 13, name: "pawn", abbr: "p", value: 7, player: "b", }, color: false, x: 5, y: 6, selected: false, enpassantable: false, moveable: false },
			{ key: 14, piece: { key: 14, name: "pawn", abbr: "p", value: 7, player: "b", }, color: true, x: 6, y: 6, selected: false, enpassantable: false, moveable: false },
			{ key: 15, piece: { key: 15, name: "pawn", abbr: "p", value: 7, player: "b", }, color: false, x: 7, y: 6, selected: false, enpassantable: false, moveable: false },
			{ key: 16, piece: { key: 16, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 0, y: 5, selected: false, enpassantable: false, moveable: false },
			{ key: 17, piece: { key: 17, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 1, y: 5, selected: false, enpassantable: false, moveable: false },
			{ key: 18, piece: { key: 18, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 2, y: 5, selected: false, enpassantable: false, moveable: false },
			{ key: 19, piece: { key: 19, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 3, y: 5, selected: false, enpassantable: false, moveable: false },
			{ key: 20, piece: { key: 20, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 4, y: 5, selected: false, enpassantable: false, moveable: false },
			{ key: 21, piece: { key: 21, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 5, y: 5, selected: false, enpassantable: false, moveable: false },
			{ key: 22, piece: { key: 22, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 6, y: 5, selected: false, enpassantable: false, moveable: false },
			{ key: 23, piece: { key: 23, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 7, y: 5, selected: false, enpassantable: false, moveable: false },
			{ key: 24, piece: { key: 24, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 0, y: 4, selected: false, enpassantable: false, moveable: false },
			{ key: 25, piece: { key: 25, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 1, y: 4, selected: false, enpassantable: false, moveable: false },
			{ key: 26, piece: { key: 26, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 2, y: 4, selected: false, enpassantable: false, moveable: false },
			{ key: 27, piece: { key: 27, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 3, y: 4, selected: false, enpassantable: false, moveable: false },
			{ key: 28, piece: { key: 28, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 4, y: 4, selected: false, enpassantable: false, moveable: false },
			{ key: 29, piece: { key: 29, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 5, y: 4, selected: false, enpassantable: false, moveable: false },
			{ key: 30, piece: { key: 30, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 6, y: 4, selected: false, enpassantable: false, moveable: false },
			{ key: 31, piece: { key: 31, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 7, y: 4, selected: false, enpassantable: false, moveable: false },
			{ key: 32, piece: { key: 32, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 0, y: 3, selected: false, enpassantable: false, moveable: false },
			{ key: 33, piece: { key: 33, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 1, y: 3, selected: false, enpassantable: false, moveable: false },
			{ key: 34, piece: { key: 34, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 2, y: 3, selected: false, enpassantable: false, moveable: false },
			{ key: 35, piece: { key: 35, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 3, y: 3, selected: false, enpassantable: false, moveable: false },
			{ key: 36, piece: { key: 36, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 4, y: 3, selected: false, enpassantable: false, moveable: false },
			{ key: 37, piece: { key: 37, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 5, y: 3, selected: false, enpassantable: false, moveable: false },
			{ key: 38, piece: { key: 38, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 6, y: 3, selected: false, enpassantable: false, moveable: false },
			{ key: 39, piece: { key: 39, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 7, y: 3, selected: false, enpassantable: false, moveable: false },
			{ key: 40, piece: { key: 40, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 0, y: 2, selected: false, enpassantable: false, moveable: false },
			{ key: 41, piece: { key: 41, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 1, y: 2, selected: false, enpassantable: false, moveable: false },
			{ key: 42, piece: { key: 42, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 2, y: 2, selected: false, enpassantable: false, moveable: false },
			{ key: 43, piece: { key: 43, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 3, y: 2, selected: false, enpassantable: false, moveable: false },
			{ key: 44, piece: { key: 44, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 4, y: 2, selected: false, enpassantable: false, moveable: false },
			{ key: 45, piece: { key: 45, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 5, y: 2, selected: false, enpassantable: false, moveable: false },
			{ key: 46, piece: { key: 46, name: "a", abbr: "a", value: 0, player: "a", }, color: true, x: 6, y: 2, selected: false, enpassantable: false, moveable: false },
			{ key: 47, piece: { key: 47, name: "a", abbr: "a", value: 0, player: "a", }, color: false, x: 7, y: 2, selected: false, enpassantable: false, moveable: false },
			{ key: 48, piece: { key: 48, name: "pawn", abbr: "P", value: 1, player: "w", }, color: false, x: 0, y: 1, selected: false, enpassantable: false, moveable: false },
			{ key: 49, piece: { key: 49, name: "pawn", abbr: "P", value: 1, player: "w", }, color: true, x: 1, y: 1, selected: false, enpassantable: false, moveable: false },
			{ key: 50, piece: { key: 50, name: "pawn", abbr: "P", value: 1, player: "w", }, color: false, x: 2, y: 1, selected: false, enpassantable: false, moveable: false },
			{ key: 51, piece: { key: 51, name: "pawn", abbr: "P", value: 1, player: "w", }, color: true, x: 3, y: 1, selected: false, enpassantable: false, moveable: false },
			{ key: 52, piece: { key: 52, name: "pawn", abbr: "P", value: 1, player: "w", }, color: false, x: 4, y: 1, selected: false, enpassantable: false, moveable: false },
			{ key: 53, piece: { key: 53, name: "pawn", abbr: "P", value: 1, player: "w", }, color: true, x: 5, y: 1, selected: false, enpassantable: false, moveable: false },
			{ key: 54, piece: { key: 54, name: "pawn", abbr: "P", value: 1, player: "w", }, color: false, x: 6, y: 1, selected: false, enpassantable: false, moveable: false },
			{ key: 55, piece: { key: 55, name: "pawn", abbr: "P", value: 1, player: "w", }, color: true, x: 7, y: 1, selected: false, enpassantable: false, moveable: false },
			{ key: 56, piece: { key: 56, name: "rook", abbr: "R", value: 4, player: "w", }, color: true, x: 0, y: 0, selected: false, enpassantable: false, moveable: false },
			{ key: 57, piece: { key: 57, name: "knight", abbr: "N", value: 3, player: "w", }, color: false, x: 1, y: 0, selected: false, enpassantable: false, moveable: false },
			{ key: 58, piece: { key: 58, name: "bishop", abbr: "B", value: 2, player: "w", }, color: true, x: 2, y: 0, selected: false, enpassantable: false, moveable: false },
			{ key: 59, piece: { key: 59, name: "queen", abbr: "Q", value: 6, player: "w", }, color: false, x: 3, y: 0, selected: false, enpassantable: false, moveable: false },
			{ key: 60, piece: { key: 60, name: "king", abbr: "K", value: 5, player: "w", }, color: true, x: 4, y: 0, selected: false, enpassantable: false, moveable: false },
			{ key: 61, piece: { key: 61, name: "bishop", abbr: "B", value: 2, player: "w", }, color: false, x: 5, y: 0, selected: false, enpassantable: false, moveable: false },
			{ key: 62, piece: { key: 62, name: "knight", abbr: "N", value: 3, player: "w", }, color: true, x: 6, y: 0, selected: false, enpassantable: false, moveable: false },
			{ key: 63, piece: { key: 63, name: "rook", abbr: "R", value: 4, player: "w", }, color: false, x: 7, y: 0, selected: false, enpassantable: false, moveable: false }
		];
	}

	// create an empty or default tile
	// public createEmptyTile(key: number) {
	// 	return {
	// 		key: key,
	// 		piece: this.pieceService.createNullPiece(null),
	// 		color: false,
	// 		x: 0,
	// 		y: 0,
	// 		selected: false,
	// 		enpassantable: false,
	// 		moveable: false,
	// 	}
	// }

	public validateFenValue(fen: string): boolean {
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

	public updateFenValueFromBoardState(): void {
		let string: string = "";
		let rowID: number = 0;
		let spaces = 0;

		this.board.forEach((tile) => {
			let data = tile.piece.value;
			if (data !== 0) {
				string = spaces != 0 ? (string += spaces) : string;
				spaces = 0;
				string += this.pieceService.findAbbr(data);
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
		this.fenValue = string.slice(0, -1) + " w KQkq - 0 1";

	}

	public findTile(x: number, y: number): Tile {
		return this.board.find((tile) => tile.x === x && tile.y === y);
	}

	public getLetter(index: number): string {
		return this._letters[index];
	}
}
