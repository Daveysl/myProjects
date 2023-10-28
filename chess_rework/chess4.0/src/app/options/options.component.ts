import { Component } from "@angular/core";

@Component({
  selector: "app-options",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.scss"],
})
export class OptionsComponent {
  public optionsList: string[] = ["Piece Set", "FEN"];
  public pieceSetList: string[] = ['cburnett']
  public fenValue: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  private _pieceSet: string = "cburnett";
  private _openedTab: string = "Piece Set";

  constructor () {

  }

  public get pieceSet(): string { return this._pieceSet; }
  public set pieceSet(v: string) {
    this._pieceSet = v;
  }
  public get openedTab(): string { return this._openedTab; }
  public set openedTab(v: string) {
    this._openedTab = v;
  }

  public onFenValueChange(value: string): void {
    this.fenValue = value;
  }

  public changeTheme(value: string): void {
    this.pieceSet = value;
  }
  public openTab(value: string) {
    this.openedTab = value;
  }
  public changeSet(value: string): void {
    this.pieceSet = value;
  }
  public reset(): void {
    // this.setDefaults();
  }
}

