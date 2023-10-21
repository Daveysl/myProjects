import { Component } from '@angular/core';
import { Move, Turn } from "../models/moves.model"
import { HistoryService } from '../services/history.service';
import { MovesService } from '../services/moves.service';
import { OptionsService } from '../services/options.service';

@Component({
	selector: 'app-move-history',
	templateUrl: './move-history.component.html',
	styleUrls: ['./move-history.component.scss']
})
export class MoveHistoryComponent {
	public movesH: Turn[];

	constructor(
		private historyService: HistoryService,
		private moveService: MovesService,
		private optionsService: OptionsService
	) {
		this.initMoveHistory();
	}
	
	public getPast(move: Move) {
		console.log("getPast");

		this.historyService.moveHistory.forEach((turn) => {
			turn.white.current = false;
			turn.black.current = false;
		});

		// call board service for these
		this.optionsService.options.fenValue = move.fenState;
		this.moveService.importFenValue(move.fenState);

		if (move.piece.player === "w") {
			this.historyService.moveHistory[move.turnNum - 1].white.current = true;
			this.moveService.currentPlayer = "b";
			this.historyService.moveHistory.splice(move.turnNum);
			this.historyService.moveHistory[move.turnNum - 1].black = this.historyService.initMove();
		} else {
			this.historyService.moveHistory[move.turnNum - 1].black.current = true;
			this.moveService.currentPlayer = "w";
			this.historyService.moveHistory.splice(move.turnNum);
		}
	}

	// private methods
	private initMoveHistory() {
		this.movesH = this.historyService.moveHistory;
	}

}
