import { Component } from "@angular/core";
import { ChessOptions } from "../chess/options/options.model";
import { OptionsService } from "../chess/options/options.service";
import { BoardService } from "../chess/board/board.service";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent {
  public OPTIONS_LIST: string[] = ["Piece Set", "FEN"];
  public options: ChessOptions;
  constructor(
    private optionsService: OptionsService,
    private boardService: BoardService
  ) {
    this.options = optionsService.options;
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

