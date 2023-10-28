import { CdkDrag, CdkDragMove, CdkDragStart, DragRef, Point } from '@angular/cdk/drag-drop';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Piece } from 'src/app/models/piece.model';
import { Tile } from 'src/app/models/tile.model';
import { MoveService } from 'src/app/services/move.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {

  @Input()
  get tile(): Tile { return this._tile; }
  set tile(value: Tile) {
    this._tile = (value) || this.newTile();
  }
  private _tile: Tile = this.newTile();

  @Output() newBoardEvent = new EventEmitter<Tile[]>();

  constructor (private moveService: MoveService) { }
  ngOnChanges(changes: SimpleChanges) { }

  public piecePickedUp(event: CdkDragStart<Tile>, tile: Tile) {
    // console.log(tile.piece.name)
    // console.log("source:", event.source.data)
    // console.log("dropcontainer:", event.source.dropContainer.data)

    console.log(tile.piece.name, "picked up from", tile.x, tile.y);
    let newBoard = this.moveService.boardState;
    // TODO: instead of returning existingTiles

    let existingTiles = this.moveService.existingTiles(tile);

    newBoard.forEach(
      (t) => {
        if (existingTiles.includes(t)) {
          t.moveable = true;
        }
      }
    )
    this.newBoardEvent.emit(newBoard);
    this.moveService.updateBoardState(newBoard);
  }

  private newTile(): Tile {
    return {
      key: 0,
      piece: {
        key: 0,
        name: '',
        abbr: '',
        value: 0,
        player: '',
        x: 0,
        y: 0
      },
      x: 0,
      y: 0,
      dark: false,
      moveable: false
    }
  }

  public dragMouse(point: Point, dragRef: DragRef) { return point; }
}
