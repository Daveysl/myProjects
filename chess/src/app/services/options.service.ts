import { Injectable } from '@angular/core';
import { BoardService } from './board.service';
import { HistoryService } from './history.service';
import { Turn } from '../models/moves.model';
import { MovesService } from './moves.service';
import { ChessOptions } from "../models/options.model";
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  public DEFAULT_FEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
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

  private _pieceSet: string;
  private _pieceSetList: string[];
  private _display: string;

  // -------------------------------------------------- 
  public moveHistory: Turn[];


  constructor (
    private historyService: HistoryService,
  ) {
    this.moveHistory = this.historyService.moveHistory;
    this.setOptionsDefaults();
  }


  public get pieceSet(): string { return this._pieceSet; }
  public set pieceSet(v: string) { this._pieceSet = v; }

  public get pieceSetList(): string[] { return this._pieceSetList; }
  public set pieceSetList(v: string[]) { this._pieceSetList = v; }

  public get display(): string { return this._display; }
  public set display(v: string) { this._display = v; }




  public setOptionsDefaults(): void {
    this.pieceSet = this.DEFAULT_PIECESET;
    this.pieceSetList = this.DEFAULT_THEMES;
    this.display = this.DEFAULT_DISPLAY;
  }

}
