import { Component } from '@angular/core';
import { Tile } from "../models/tile.model"

import { CdkDrag, DragRef, Point } from "@angular/cdk/drag-drop";
import { MovesService } from '../services/moves.service';
import { OptionsService } from '../services/options.service';
import { ChessOptions } from '../models/options.model';
import { BoardService } from '../services/board.service';

@Component({
	selector: 'app-chessboard',
	templateUrl: './chessboard.component.html',
	styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent {

	// list of coordinate letters
	public LETTERS: string[];
	public options: ChessOptions;

	// board initiated
	public board: Tile[];

	public currentPlayer: string;

	constructor(
		private moveService: MovesService, 
		private optionsService: OptionsService, 
		private boardService: BoardService
		) {
		this.options = this.optionsService.options;
		this.currentPlayer = this.moveService.currentPlayer;
		this.board = this.boardService.board;
		this.LETTERS = this.moveService.letters;
	}

	// Event Listeners
	public pieceClicked(event: MouseEvent, key: number): void {

		// initialize the board
		//  replace this with a new function for cleanup
		let tile = this.board.find((tile) => tile.key === key);
		this.board.forEach((tile) => {
			tile.selected = false;
			tile.moveable = false;
		});

		console.log("tile:", this.moveService.getLetter(tile.x) + (tile.y + 1));

		switch (this.moveService.step) {
			case "piece":
				if (tile.piece.player === this.moveService.currentPlayer) {
					this.moveService.selectTile(tile);
				}
				break;
			case "location":
				if (tile.piece.player !== this.moveService.currentPlayer) {
					this.moveService.selectLocation(tile);
				} else {
					if (tile.piece.key !== this.moveService.storedTile.piece.key) {
						this.moveService.selectTile(tile);
					} else {
						this.moveService.step = "piece";
					}
				}
				break;
			default:
				console.error("something broke...");
				break;
		}
	}
	public piecePickedUp(event: CdkDrag<Tile>, tile: Tile) {
		console.log("piece picked up:", tile.piece.name, event);
		this.moveService.selectTile(tile);
	}
	public pieceDropped(tile: Tile) {
		if (this.moveService.storedTile.piece.player !== "" && this.moveService.storedTile.piece.player !== tile.piece.player) {
			this.moveService.selectLocation(tile);
		} else {
			console.log("oops");
		}
	}
	public dragMouse(point: Point, dragRef: DragRef) {
		return point;
	}
}
