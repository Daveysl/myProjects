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

export interface Piece {
    key:    number;
    name:   string;
    abbr:   string;
    value:  number;
    player: string;
    validMoves: number[][];
}

export interface ChessOptions {
    pieceSet:     string;
    pieceSetList: string[];
    fenValue:     string;
    display:      string;
}

export interface Castling {
    wlong:  boolean;
    wshort: boolean;
    blong:  boolean;
    bshort: boolean;
}

export interface Turn {
    num:   number;
    white: Move;
    black: Move;
}

export interface Move {
    turnNum:   number;
    piece:     Piece;
    capturing: boolean;
    past:      number[];
    new:       number[];
    notation:  string;
    fenState:  string;
    current:   boolean;
}

export interface ValidationData {
    moves: number[][];
    x2:    number;
    y2:    number;
    pV: number;
}