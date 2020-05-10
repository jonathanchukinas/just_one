export type AddPlayer = {
  type: 'ADD_PLAYER';
  // TODO replace this number with PlayerID type (requires file refactoring)
  playerID?: number;
}

// TODO implement this
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
  playerID: number;
  clue: string;
  // TODO needs turn num
}

export type WithdrawClue = {
  type: 'WITHDRAW_CLUE';
  playerID: number;
  // TODO needs turn num
}

// export type Disconnect = {
//   type: 'DISCONNECT';
//   playerID: number;
// }
