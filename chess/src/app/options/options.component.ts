import { Component } from "@angular/core";
import { ChessOptions } from "../models/options.model";
import { OptionsService } from "../services/options.service";
import { BoardService } from "../services/board.service";
import { HistoryService } from "../services/history.service";
import { Turn } from "../models/moves.model";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent {
  public OPTIONS_LIST: string[] = ["Piece Set", "FEN"];
  public options: ChessOptions;
  public movesHistory: Turn[];
  constructor(
    private optionsService: OptionsService,
    private boardService: BoardService,
    private historyService: HistoryService
  ) {
    this.options = optionsService.options;
    this.movesHistory = this.historyService.moveHistory;
  }

  public onFenValueChange(value: string): void {
    if (this.boardService.validateFenValue(value)) {
      // this.importFenValue(value);
      this.boardService.fenValue = value;
    }
  }

  public changeTheme(theme: string): void {
    this.options.pieceSet = theme;
    console.log("theme is", theme);
  }
  public openTab(tab: string) {
    this.options.display = tab;
  }
  public changeSet(theme: string): void {
    this.options.pieceSet = theme;
    console.log("theme is", theme);
  }
  public reset(): void {
    this.optionsService.setDefaults();
  }
}

