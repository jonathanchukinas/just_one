export type NamePlayer = {
  type: 'NAME_PLAYER';
  playerID: number;
  playerName: string;
}

export type AddPlayer = {
  type: 'ADD_PLAYER';
  playerID?: number;
}

export type SubmitClue = {
  type: 'SUBMIT_CLUE';
  playerID: number;
  clue: string;
}

export type WithdrawClue = {
  type: 'WITHDRAW_CLUE';
  playerID: number;
}

export type Disconnect = {
  type: 'DISCONNECT';
  playerID: number;
}
