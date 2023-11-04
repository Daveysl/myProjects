import { Injectable } from '@angular/core';
import { Tile } from '../models/types.model';

@Injectable({
  providedIn: 'root'
})
export class LogicService {

  constructor () {

  }

  public validatePiece(oldt: Tile, newt: Tile) {
    let validMoves:Tile[] = [];

    switch (oldt.piece.name) {
      case "pawn": validMoves = this.pawn(oldt, newt); break;
      case "knight": validMoves = this.knight(oldt, newt); break;
      case "bishop": validMoves = this.bishop(oldt, newt); break;
      case "rook": validMoves = this.rook(oldt, newt); break;
      case "queen": validMoves = this.queen(oldt, newt); break;
      case "king": validMoves = this.king(oldt, newt); break;
    }
  }

  public pawn(oldt: Tile, newt: Tile) {
    // oldt = tile pawn is currently on
    // newt = tile pawn to move to

    // create new array of validMoves
    let validMoves:Tile[] = [];

    // check for single pawn move 

    return validMoves;
  }

  public knight(oldt: Tile, newt: Tile) {
    // oldt = tile pawn is currently on
    // newt = tile pawn to move to

    // create new array of validMoves
    let validMoves:Tile[] = [];

    // check for single pawn move 

    return validMoves;
  }

  public bishop(oldt: Tile, newt: Tile) {
    // oldt = tile pawn is currently on
    // newt = tile pawn to move to

    // create new array of validMoves
    let validMoves:Tile[] = [];

    // check for single pawn move 

    return validMoves;
  }
  
  public rook(oldt: Tile, newt: Tile) {
    // oldt = tile pawn is currently on
    // newt = tile pawn to move to

    // create new array of validMoves
    let validMoves:Tile[] = [];

    // check for single pawn move 

    return validMoves;
  }

  public queen(oldt: Tile, newt: Tile) {
    // oldt = tile pawn is currently on
    // newt = tile pawn to move to

    // create new array of validMoves
    let validMoves:Tile[] = [];

    // check for single pawn move 

    return validMoves;
  }

  public king(oldt: Tile, newt: Tile) {
    // oldt = tile pawn is currently on
    // newt = tile pawn to move to

    // create new array of validMoves
    let validMoves:Tile[] = [];

    // check for single pawn move 

    return validMoves;
  }
}
