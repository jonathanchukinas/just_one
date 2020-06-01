import {
  TurnNum,
  TurnGetter,
} from './types'


export class Turn {

  private turnNum: TurnNum
  readonly turnGetter: TurnGetter
  
  constructor() {
    this.turnNum = 0
    this.turnGetter = this.buildTurnGetter()
  }

  get(): TurnNum {
    return this.turnNum;
  }

  startNewTurn(): TurnNum {
    this.turnNum += 1;
    return this.turnNum;
  }

  private buildTurnGetter(): TurnGetter {
    const turn = this;
    const turnGetter = ()=>{
      return turn.get()
    };
    return turnGetter;
  }

}
