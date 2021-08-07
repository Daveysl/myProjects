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