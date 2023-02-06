import { Injectable } from '@angular/core';
import { Move, Turn } from "../moves/moves.model"
import { PieceLogicService } from '../pieces/piece-logic.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private _moveHistory: Turn[];

  constructor(private piecesService: PieceLogicService) {
    this._moveHistory = [];
  }

  get moveHistory(): Turn[] {
    return this._moveHistory;
  }

  public createNewTurn(): Turn {
		return {
			num: this.moveHistory.length + 1,
			white: this.initMove(),
			black: this.initMove(),
		};
	}

  private initMove(): Move {
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
