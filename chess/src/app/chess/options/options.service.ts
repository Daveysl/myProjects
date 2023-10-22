import { Injectable } from '@angular/core';
import { BoardService } from '../board/board.service';
import { Tile } from '../board/tile.model';
import { MovesService } from '../moves/moves.service';
import { ChessOptions } from "../options/options.model";

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  private _options: ChessOptions;

  public DEFAULT_FEN: string =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  public DEFAULT_PIECESET: string = "cburnett";
  public DEFAULT_DISPLAY: string = "Piece Set";
  public DEFAULT_THEMES: string[] = [
    "theme1",
    "theme2",
    "alpha",
    "california",
    "cardinal",
    "cburnett",
    "chess7",
    "chessnut",
    "companion",
    "dubrovny",
    "fantasy",
    "fresca",
    "gioco",
    "governor",
    "horsey",
    "icpieces",
    "kosal",
    "leipzig",
    "letter",
    "libra",
    "maestro",
    "merida",
    "pirouetti",
    "pixel",
    "reillycraig",
    "riohacha",
    "shapes",
    "spatial",
    "staunty",
    "tatiana",
  ];

  constructor(
    private movesService: MovesService,
    private boardService: BoardService,
  ) { 
    this.setDefaults();
  }

  public get options() : ChessOptions {
    return this._options;
  }
  
  public set options(value : ChessOptions) {
    this._options = value;
  }


  public setDefaults(): void {
      // Variables
      this.movesService.storedTile = this.boardService.createEmptyTile(null);
      this.movesService.currentPlayer = "w";
      this.movesService.step = "piece";
  
      // Objects
      this.boardService.castling = {
        wlong: true,
        wshort: true,
        blong: true,
        bshort: true,
      };
      this.boardService.importFenValue(this.DEFAULT_FEN);
    
    this.options = {
      pieceSet: this.DEFAULT_PIECESET,
      pieceSetList: this.DEFAULT_THEMES,
      fenValue: this.DEFAULT_FEN,
      display: this.DEFAULT_DISPLAY,
    };
  }

}
