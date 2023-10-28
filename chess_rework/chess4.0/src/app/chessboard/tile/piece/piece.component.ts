import { Component, Input } from '@angular/core';
import { Piece } from '../../../models/piece.model';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss']
})
export class PieceComponent {

  public pieceIcon: string = '';
  public pieceSet: string = "cburnett";

  @Input() piece: Piece = this.newPiece();

  constructor () { }

  ngOnChanges() {
    this.pieceIcon = `assets/${this.pieceSet}/${this.piece.player}${this.piece.abbr.toUpperCase()}.svg`;
  }

  private newPiece(): Piece {
    return {
      key: 0,
      name: '',
      abbr: '',
      value: 0,
      player: '',
      x: 0,
      y: 0
    }
  }
}