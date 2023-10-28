import { Piece } from "./piece.model";

export interface Tile {
    key: number;
    piece: Piece;
    x: number;
    y: number;
    dark: boolean;
    moveable: boolean;
}

