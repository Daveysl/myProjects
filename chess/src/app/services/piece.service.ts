import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PieceService {
  private _key: number;
  private _name: string;
  private _abbr: string;
  private _value: number;
  private _player: string;
  private _validMoves: number[][];

  constructor() {}

  public get key(): number {return this._key;}
  public set key(value: number) {
    this._key = value;
  }

  public get name(): string {return this._name;}
  public get abbr(): string {return this._abbr;}
  public get value(): number {return this._value;}
  public get player(): string {return this._player;}

  public get validMoves(): number[][] {return this._validMoves;}
  public set validMoves(value: number[][]) {
    this._validMoves = value;
  }

}
