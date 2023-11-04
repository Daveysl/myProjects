import { CdkDrag, CdkDragMove, CdkDragStart, DragRef, Point } from '@angular/cdk/drag-drop';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Piece, Tile } from 'src/app/models/types.model';
import { ChessService } from 'src/app/services/chess.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {

  @Input()
  get tile(): Tile { return this._tile; }
  set tile(value: Tile) {
    this._tile = value;
  }
  private _tile: Tile;

  constructor (private chess: ChessService) {
    this._tile = chess.newTile()
  }


  public piecePickedUp(event: CdkDragStart<Tile>, tile: Tile) {
    let newBoard = this.chess.board;
    // TODO: instead of returning existingTiles
    let existingTiles = this.chess.existingTiles(tile);
    console.log(this.chess.getMoveNotation(tile.x, tile.y))

    newBoard.forEach(
      (t) => {
        if (existingTiles.includes(t)) {
          t.moveable = true;
        }
      }
    )
    this.chess.updateBoardState(newBoard);
  }

  public dragMouse(point: Point) {
    return point;
  }
}
