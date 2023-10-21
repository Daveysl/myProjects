import { Injectable } from '@angular/core';
import { BoardService } from './board.service';
import { HistoryService } from './history.service';
import {Turn } from '../models/moves.model';
import { MovesService } from './moves.service';
import { ChessOptions } from "../models/options.model";

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
  public moveHistory: Turn[];

  constructor(
    private movesService: MovesService,
    private boardService: BoardService,
    private historyService: HistoryService,
  ) { 
    this.setDefaults();
    this.moveHistory = this.historyService.moveHistory;
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

      this.historyService.clearHistory();
  
      // Objects
      this.boardService.castling = {
        wlong: true,
        wshort: true,
        blong: true,
        bshort: true,
      };
      this.movesService.importFenValue(this.DEFAULT_FEN);
    
    this.options = {
      pieceSet: this.DEFAULT_PIECESET,
      pieceSetList: this.DEFAULT_THEMES,
      fenValue: this.DEFAULT_FEN,
      display: this.DEFAULT_DISPLAY,
    };
  }

}
