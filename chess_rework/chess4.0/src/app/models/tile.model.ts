import { Piece } from "./piece.model";

export interface Tile {
    key: number;
    piece: Piece;
    dark: boolean;
    coord: number[];
}

