import type {
  PlayerID,
  TurnNum,
} from './simpleTypes'

/**************************************
  CONTEXT
**************************************/

export enum ConnectionStatus {
  Active,
  Disconnected,
}

export interface Player {
  connection: ConnectionStatus;
  id: PlayerID;
  name?: string;
  clues: Map<TurnNum, string>;
}

export interface NoPlayer {
  id: null
}

export type Players = Map<PlayerID, Player>;

export interface GameContext {
  self: NoPlayer | Player;
  players: Players;
  turnNumber: number;
}

/**************************************
  MACHINE
**************************************/

export interface GameSchema {
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

export type GameEvent = 
  | E.AddPlayer
  | E.NamePlayer
  | E.SubmitClue
  | E.WithdrawClue
  // | E.Disconnect

/**************************************
  functions
**************************************/

export function getPlayer(players: Players, id: PlayerID): Player {
  const player = players.get(id)
  if (player) {
    return player
  } else {
    throw(`Player${id} hasn't been created yet!`)
  }
}
