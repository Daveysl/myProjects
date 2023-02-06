import { Component } from '@angular/core';
import { Move, Turn, Castling } from "../chess/moves/moves.model"
import { PieceLogicService } from '../chess/pieces/piece-logic.service';
import { HistoryService } from '../chess/moves/history.service';
import { MovesService } from '../chess/moves/moves.service';
import { OptionsService } from '../chess/options/options.service';
import { BoardService } from '../chess/board/board.service';

@Component({
	selector: 'app-move-history',
	templateUrl: './move-history.component.html',
	styleUrls: ['./move-history.component.scss'],
	providers: [PieceLogicService]
})
export class MoveHistoryComponent {
	public moveHistory: Turn[];

	constructor(
		private history: HistoryService,
		private moves: MovesService,
		private optionsService: OptionsService,
		private boardService: BoardService
	) {
		this.moveHistory = history.moveHistory;
	}

	// private methods
	public setTurn(move: Move): void {
		let turn = this.moves.currentPlayer === "w"
			? this.history.createNewTurn()
			: this.history.moveHistory[this.history.moveHistory.length - 1];

		if (this.moves.currentPlayer === "w") {
			turn.white = move;
			turn.white.turnNum = turn.num;
			this.history.moveHistory.push(turn);
		} else {
			turn.black = move;
			turn.black.turnNum = turn.num;
		}
	}

	public getPast(move: Move) {
		this.history.moveHistory.forEach((turn) => {
			turn.white.current = false;
			turn.black.current = false;
		});


		// call board service for these
		this.optionsService.options.fenValue = move.fenState;
		this.boardService.importFenValue(move.fenState);
	

		if (move.piece.player === "w") {
			this.moveHistory[move.turnNum - 1].white.current = true;
			this.moves.currentPlayer = "b";
			this.moveHistory.splice(move.turnNum);
			this.moveHistory[move.turnNum - 1].black = this.moves.initMove();
		} else {
			this.moveHistory[move.turnNum - 1].black.current = true;
			this.moves.currentPlayer = "w";
			this.moveHistory.splice(move.turnNum);
		}
	}

}
