import { Injectable } from '@angular/core';
import { BoardService } from '../board/board.service';
import { Tile } from '../board/tile.model';
import { ValidationData } from './validation.model';
import { PieceLogicService } from '../pieces/piece-logic.service';
import { MovesService } from './moves.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor(
    private pieceService: PieceLogicService,
    private boardService: BoardService,
    private movesService: MovesService,
  ) {

  }

  

  
}
