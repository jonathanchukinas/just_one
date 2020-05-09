

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

interface PlayerName {
  type: 'PLAYER_NAME';
  playerID: PlayerID;
  playerName: string;
}

type GameEvent = 
  {
    type: 'PLAYER_ADD';
    playerID?: PlayerID;
  }
  | PlayerName
  | {
    type: 'CLUE_SUBMIT';
    playerID: PlayerID;
    value: string;
  }
  | {
    type: 'CLUE_WITHDRAW';
    playerID: PlayerID;
  }
  | {
    type: 'DISCONNECT';
    playerID: PlayerID;
  }

/**************************************
  export
**************************************/

export type {
  GameContext,
  GameSchema,
  GameEvent,
}
