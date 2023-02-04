import { Injectable } from '@angular/core';
import { Move } from './moves.model'
@Injectable({
  providedIn: 'root'
})
export class MovesService {
  public LETTERS: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

  constructor() { }

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

  private getLetter(value: number): string {
		return this.LETTERS[value];
	}
}
