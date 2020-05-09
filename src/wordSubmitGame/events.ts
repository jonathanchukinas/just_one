export type NamePlayer = {
  type: 'NAME_PLAYER';
  playerIndex: number;
  playerName: string;
}

export type AddPlayer = {
  type: 'PLAYER_ADD';
  playerIndex?: number;
}

export type SubmitClue = {
  type: 'SUBMIT_CLUE';
  playerIndex: number;
  clue: string;
}

export type WithdrawClue = {
  type: 'WITHDRAW_CLUE';
  playerIndex: number;
}

export type Disconnect = {
  type: 'DISCONNECT';
  playerIndex: number;
}
