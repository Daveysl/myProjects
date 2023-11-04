import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChessboardComponent } from './chessboard/chessboard.component';
import { PieceComponent } from './chessboard/tile/piece/piece.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TileComponent } from './chessboard/tile/tile.component';
import { OptionsComponent } from './options/options.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChessService } from './services/chess.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ChessboardComponent,
    PieceComponent,
    TileComponent,
    OptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    FormsModule
  ],
  providers: [ChessService],
  bootstrap: [AppComponent]
})
export class AppModule { }
