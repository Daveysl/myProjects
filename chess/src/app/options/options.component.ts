import { Component } from '@angular/core';
import { ChessOptions } from "../options/options.model"
import { MovesService } from "../chess/moves/moves.service"
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {
  public OPTIONS_LIST: string[] = ["Piece Set", "FEN"];
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
  public options: ChessOptions;

  
  constructor () {
    this.setDefaults()
  }

  private setDefaults(): void {
    this.options = {
			pieceSet: this.DEFAULT_PIECESET,
			pieceSetList: this.DEFAULT_THEMES,
			fenValue: this.DEFAULT_FEN,
			display: this.DEFAULT_DISPLAY,
		};
  }

  public changeTheme(theme: string): void {
		this.options.pieceSet = theme;
		console.log("theme is", theme);
	}
  
  

  
}
