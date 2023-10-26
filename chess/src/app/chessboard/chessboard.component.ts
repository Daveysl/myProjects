import { Component } from '@angular/core';
import { Tile } from "../models/tile.model"

import { CdkDrag, DragRef, Point } from "@angular/cdk/drag-drop";
import { MovesService } from '../services/moves.service';
import { ChessOptions } from '../models/options.model';
import { BoardService } from '../services/board.service';
import { GameService } from '../services/game.service';
import { OptionsService } from '../services/options.service';

@Component({
	selector: 'app-chessboard',
	templateUrl: './chessboard.component.html',
	styleUrls: ['./chessboard.component.scss'],
	providers: [GameService]
})
export class ChessboardComponent {
	/**
	 * ##### Chessboard component #####
	 * - Initializes board state
	 * - Detects user inputs
	 * -- Piece clicked
	 * -- Piece picked up
	 * -- Piece dropped
	 * - Initializes LETTERS 
	 * - Initializes CURRENT_PLAYER
	 * - Initializes OPTIONS
	 */

	// list of coordinate letters
	public LETTERS: string[];
	public options: ChessOptions;

	// board init
	public board: Tile[];
	public pieceSet: string = this.optionsService.pieceSet;

	constructor (
		private gameService: GameService,
		private optionsService: OptionsService,
		private boardService: BoardService
	) {
		this.board = this.boardService.board;
		this.LETTERS = this.boardService.letters;
	}

	// Event Listeners
	public pieceClicked(event: MouseEvent, tile: Tile): void {
		console.log("Tile clicked:", tile.x, tile.y);
		console.log(this.gameService.turnStep)
		this.board.forEach((tile) => {
			tile.selected = false;
			tile.moveable = false;
		});

		switch (this.gameService.turnStep) {
			case "piece":
				this.gameService.selectPiece(tile);
				break;
			case "location":
				if (tile.piece.player !== this.gameService.currentPlayer) {
					this.gameService.selectLocation(tile);
				} else {
					if (tile.piece.key !== this.gameService.savedTile.piece.key) {
						this.gameService.selectPiece(tile);
					} else {
						this.gameService.turnStep = "piece";
					}
				}
				break;
			default:
				console.error("something broke...");
				break;
		}
	}
	public piecePickedUp(event: CdkDrag<Tile>, tile: Tile) {
		console.log(tile.key)

		this.gameService.selectPiece(tile);
	}
	public pieceDropped(tile: Tile) {
		console.log(tile.key)
		this.gameService.selectLocation(tile);
	}

	public dragMouse(point: Point, dragRef: DragRef) {
		return point;
	}
}
