export interface Tile {
    key: number;
    piece: Piece;
    color: boolean;
    x: number;
    y:number;
    selected: boolean;
    enpassant: boolean;
    moveable: boolean;
}

export interface Piece {
    key: number;
    name: string;
    abbr: string;
    value: number;
    player: string;
}

export interface ChessOptions {
    pieceSet: string;
    pieceSetList: string[];
    fenValue: string;
    display: string;
}

export interface Castling {
    wlong: boolean;
    wshort: boolean;
    blong: boolean;
    bshort: boolean;
}

export interface Turn {
    num: number;
    white: Move;
    black: Move;
}

export interface Move {
    piece: Piece;
    capturing: boolean;
    past: number[];
    new: number[];
    notation: string;
    fenState: string;
}