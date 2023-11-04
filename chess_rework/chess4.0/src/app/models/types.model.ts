
export interface Tile {
    key: number;
    x: number;
    y: number;
    piece: Piece;
    dark: boolean;
    moveable: boolean;
}

export type Color = 'w' | 'b' | null;

export interface Piece {
    name: string;
    fen: string;
    abbr: string;
    color: Color;
    moves: number[][];
}