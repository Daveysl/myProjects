import { Injectable } from '@angular/core';
import { Tile } from '../models/tile.model';
import { Piece } from "../models/piece.model"

@Injectable({
	providedIn: 'root'
})
export class PieceLogicService {
	// List of each chess piece
	// first space (0) used for blank or null space
	private _pieces: Piece[];
	constructor () {
		this._pieces = [
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
	}

	public createNullPiece(key: number) {
		return {
			key: key, // ID of tile
			name: "", // name of piece
			abbr: "", // abbreviation of name
			value: 0, // numeric ID of piece
			player: "", // name of player
		};
	}
	// Gets and Sets
	public get pieces(): Piece[] {
		return this._pieces;
	}

	public findAbbr(value: number): string {
		return this.pieces[value].abbr;
	}
	public findPieceFromChar(char: string): Piece {
		let piece = this.pieces.find((piece) => piece.abbr == char);
		return piece;
	}

	// public methods -----------------------------------------------------------------------
	public getValidMoves(pastloc: Tile, newloc: Tile) {
		// 1. get the piece name
		// 2. 
	}



}