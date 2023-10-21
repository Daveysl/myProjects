import { CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { Tile } from 'src/app/models/tile.model';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  @Input() tile: Tile = this.newTile();

  ngOnChange() {
    
  }
  

  public piecePickedUp(event: CdkDragMove, tile: Tile): void {

  }

  public pieceDropped(): void {

  }

  private newTile(): Tile {
    return {
      key: 0,
      piece: {
        key: 0,
        name: '',
        abbr: '',
        value: 0,
        player: ''
      },
      dark: false,
      coord: [0,0]
    }
  }
}
