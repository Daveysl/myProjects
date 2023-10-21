
import { Piece } from "./piece.model";

export interface Move {
    turnNum:   number;
    past:      number[];
    new:       number[];
    piece:     Piece;
    notation:  string;
    fenState:  string;
    capturing: boolean;
    current:   boolean;
}

export interface Turn {
    num:   number;
    white: Move;
    black: Move;
}

export interface Castling {
    wlong:  boolean;
    wshort: boolean;
    blong:  boolean;
    bshort: boolean;
}