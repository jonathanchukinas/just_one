

/**************************************
  CONTEXT
**************************************/

enum ConnectionStatus {
  Active,
  Disconnected,
}

// TODO: I want this to be a number, but number keys get converted to strings. What to do?
// IDs start at zero.
type PlayerID = number;
type TurnNum = number

interface Player {
  connection: ConnectionStatus;
  id: number;
  name?: string;
  clues: Map<TurnNum, string>;
}

type Players = Map<PlayerID, Player>;

interface GameContext {
  self?: Player;
  players: Players;
  turnNumber: number;
}

/**************************************
  MACHINE
**************************************/

interface GameSchema {
  states: {
    noPlayers: {},
    unknown: {},
    pendingSelf: {},
    pendingOthers: {},
    complete: {},
  }
}

/**************************************
  EVENT
**************************************/

import * as E from './events'

type GameEvent = 
  | E.AddPlayer
  | E.NamePlayer
  | E.SubmitClue
  | E.WithdrawClue
  // | E.Disconnect

/**************************************
  export
**************************************/

export type {
  GameContext,
  GameSchema,
  GameEvent,
  Player,
  Players,
  PlayerID,
  TurnNum,
}

export {
  ConnectionStatus,  
}
