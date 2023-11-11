import { Component } from "@angular/core";
import { ChessOptions } from "../models/options.model";
import { OptionsService } from "../services/options.service";
import { BoardService } from "../services/board.service";
import { HistoryService } from "../services/history.service";
import { Turn } from "../models/moves.model";
import { GameService } from "../services/game.service";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent {
  public OPTIONS_LIST: string[] = ["Piece Set", "FEN"];
  public movesHistory: Turn[];
  public options: ChessOptions;
  public fenValue: string;

  constructor (
    private optionsService: OptionsService,
    private gameService: GameService,
    private boardService: BoardService,
    private historyService: HistoryService
  ) {
    this.movesHistory = this.historyService.moveHistory;
    this.fenValue = this.gameService.fenValue;
    this.options = {
      pieceSet: this.optionsService.pieceSet,
      pieceSetList: this.optionsService.pieceSetList,
      display: this.optionsService.display,
    }
  }

  public onFenValueChange(value: string): void {
    if (this.boardService.validateFenValue(value)) {
      this.boardService.fenValue = value;
    }
  }

  public changeTheme(theme: string): void {
    this.options.pieceSet = theme;
    this.optionsService.pieceSet = theme;
  }
  public openTab(tab: string) {
    this.options.display = tab;
    this.optionsService.display = tab;
  }
  public changeSet(theme: string): void {
    this.options.pieceSet = theme;
    this.optionsService.pieceSet = theme;
  }
  public reset(): void {
    this.gameService.setDefaults();
  }
}

