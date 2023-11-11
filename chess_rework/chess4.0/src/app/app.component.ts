import { Component } from '@angular/core';
import { ChessService } from './services/chess.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ChessService]
})
export class AppComponent {
  // The root for the chess program application
  // connects the child components to the DOM

  public doit = false;
  
  public doReset(v:boolean ) {
    console.log("AAAA")
    this.doit = v;
  }
}
