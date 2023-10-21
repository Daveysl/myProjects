import { Injectable } from '@angular/core';
import { Move, Turn } from "../models/moves.model"
import { PieceLogicService } from './piece-logic.service';

@Injectable({
	providedIn: 'root'
})
export class HistoryService {
	private _moveHistory: Turn[];

	constructor(
		private piecesService: PieceLogicService
		) {
			this._moveHistory = [];
	}

	get moveHistory(): Turn[] {
		return this._moveHistory;
	}
	public set moveHistory(value: Turn[]) {
		this._moveHistory = value;
	}

	// 
	public clearHistory(): void {
		this.moveHistory = [];
	}

	public createNewTurn(): Turn {
		console.log("createNewTurn")
		return {
			num: this.moveHistory.length + 1,
			white: this.initMove(),
			black: this.initMove(),
		};
	}
	public initMove(): Move {
		console.log("initMove")
		return {
			turnNum: 0,
			piece: this.piecesService.createNullPiece(null),
			capturing: false,
			past: [],
			new: [],
			notation: "",
			fenState: "",
			current: false,
		};
	}
	

}
