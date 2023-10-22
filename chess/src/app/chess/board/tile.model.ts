import { Piece } from "../pieces/piece.model";

export interface Tile {
    key:           number;
    piece:         Piece;
    color:         boolean;
    x:             number;
    y:             number;
    selected:      boolean;
    enpassantable: boolean;
    moveable:      boolean;
}

