import type {
  PlayerID,
  TurnNum,
} from './simpleTypes'

export type AddPlayer = {
  type: 'ADD_PLAYER';
  playerID?: PlayerID;
}

// TODO not yet implemented
export type SetSelf = {
  type: 'SET_SELF';
  playerID: number;
}

export type NamePlayer = {
  type: 'NAME_PLAYER';
  playerID: number;
  playerName: string;
}

export type SubmitClue = {
  type: 'SUBMIT_CLUE';
  playerID: PlayerID;
  clue: string;
}

export type WithdrawClue = {
  type: 'WITHDRAW_CLUE';
  playerID: PlayerID;
}
