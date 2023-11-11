import { Component, Input, Output, SimpleChange } from '@angular/core';
import { Tile, Piece } from '../models/types.model';
import { CdkDragDrop, CdkDragStart, Point } from '@angular/cdk/drag-drop';
import { ChessService } from '../services/chess.service';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent {

  @Input() reset = false;

  public board: Tile[];
  public pieceSet: string = 'cburnett';
  public sourceTile: HTMLElement = document.createElement('div');

  ngOnChanges() {
    this.chess.resetGame();
    this.board = this.chess.board;
  }

  constructor (private chess: ChessService) {
    this.board = chess.board;
  }

  public tileClicked(event: MouseEvent, tile: Tile): void {
    // TODO: implement click function
    console.log(tile);
  }

  public piecePickedUp(event: CdkDragStart<Tile>, tile: Tile): void {
    this.chess.resetMoveableTiles();
    let newBoard = this.chess.board;
    let existingTiles = this.chess.getValidTiles(tile);

    // console.log(this.chess.getMoveNotation(tile.x, tile.y))

    if (existingTiles.length !== 0) {
      newBoard.forEach((t) => {
        if (existingTiles.includes(t)) { t.moveable = true; }
      });
      this.chess.updateBoardState(newBoard);
      // background-color background-image background-origin background-position background-repeat background-size
    }
    this.sourceTile = event.source.dropContainer.element.nativeElement;
    this.sourceTile.classList.add('ghost');
    document.getElementsByClassName("ghost")[0].setAttribute("style", `background-image: url('../../assets/${this.pieceSet}/${tile.piece.color}${tile.piece.fen.toUpperCase()}.svg');`)
  }
  // 


  public pieceDropped($event: CdkDragDrop<Tile>, tile: Tile): void {
    this.chess.movePiece($event.item.data, tile);
    if (this.chess.validMove) {
      this.chess.resetMoveableTiles();
    }
    document.getElementsByClassName("ghost")[0].setAttribute("style", ``)
    this.sourceTile.classList.remove('ghost');
  }

  public dragMouse(point: Point) {
    return point;
  }
}