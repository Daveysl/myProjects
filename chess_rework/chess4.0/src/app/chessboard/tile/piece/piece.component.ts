import { Component, Input } from '@angular/core';
import { Piece } from 'src/app/models/types.model';
import { ChessService } from 'src/app/services/chess.service';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss']
})
export class PieceComponent {

  public pieceIcon: string = '';
  public pieceSet: string = "cburnett";

  @Input() piece: Piece = this.chess.newPiece();

  constructor (private chess: ChessService) { }

  ngOnChanges() {
    this.pieceIcon = `assets/${this.pieceSet}/${this.piece.color}${this.piece.fen.toUpperCase()}.svg`;
  }

}