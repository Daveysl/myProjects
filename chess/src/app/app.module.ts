import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ChessboardComponent } from './chessboard/chessboard.component';
import { MoveHistoryComponent } from './move-history/move-history.component';
import { OptionsComponent } from './options/options.component';
import { MovesService } from "./services/moves.service";
import { HistoryService } from "./services/history.service";
import { BoardService } from "./services/board.service";
import { PieceLogicService } from "./services/piece-logic.service";
import { OptionsService } from "./services/options.service";


@NgModule({
  declarations: [AppComponent, ChessboardComponent, MoveHistoryComponent, OptionsComponent],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    DragDropModule,
    FormsModule,
  ],
  providers: [MovesService, HistoryService, BoardService, PieceLogicService, OptionsService],
  bootstrap: [AppComponent],
})
export class AppModule { }
