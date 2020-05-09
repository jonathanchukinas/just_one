

/**************************************
  CONTEXT
**************************************/

enum ConnectionStatus {
  Active,
  Disconnected,
}

type PlayerID = number;

interface Player {
  connection: ConnectionStatus;
  id: PlayerID;
  name?: string;
  clues: { [turnNumber: number]: string }
}

interface GameContext {
  self?: PlayerID;
  players: { [playerID: number]: Player};
  turnNumber: number;
}

/**************************************
  MACHINE
**************************************/

interface GameSchema {
  states: {
    unknown: {},
    pendingSelf: {},
    pendingOthers: {},
    complete: {},
  }
}

/**************************************
  EVENT
**************************************/

type E_NamePlayer = {
  type: 'NAME_PLAYER';
  playerID: PlayerID;
  playerName: string;
}

type E_AddPlayer = {
  type: 'PLAYER_ADD';
  playerID?: PlayerID;
}

type E_SubmitClue = {
  type: 'SUBMIT_CLUE';
  playerID: PlayerID;
  value: string;
}

type E_WithdrawClue = {
  type: 'WITHDRAW_CLUE';
  playerID: PlayerID;
}

type E_Disconnect = {
  type: 'DISCONNECT';
  playerID: PlayerID;
}

type GameEvent = 
  | E_AddPlayer
  | E_NamePlayer
  | E_SubmitClue
  | E_WithdrawClue
  | E_Disconnect

/**************************************
  export
**************************************/

export type {
  GameContext,
  GameSchema,
  GameEvent,
  E_AddPlayer,
  E_NamePlayer,
  E_SubmitClue,
  E_WithdrawClue,
  E_Disconnect,
}
