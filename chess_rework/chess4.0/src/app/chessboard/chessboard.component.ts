import { Component, Input, Output, SimpleChange } from '@angular/core';
import { Tile, Piece } from '../models/types.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChessService } from '../services/chess.service';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent {

  @Input() reset = false;

  public board: Tile[];

  ngOnChanges() {
    this.chess.resetGame();
    this.board = this.chess.board;

  }

  constructor (private chess: ChessService) {
    this.board = chess.board;
  }

  public pieceDropped($event: CdkDragDrop<Tile>, tile: Tile): void {
    this.chess.movePiece($event.item.data, tile);
    this.chess.resetMoveableTiles();
  }
}