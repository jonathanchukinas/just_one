import type {
  PlayerID,
  TurnNum,
  Clue,
} from './simpleTypes'
import * as E from './events'

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
  turnNum: TurnNum;
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

export type GameEvent = 
  | E.AddPlayer
  | E.NamePlayer
  | E.SubmitClue
  | E.SetSelf
  // | E.WithdrawClue
  // | E.Disconnect

/**************************************
  functions
**************************************/

export function getPlayer(players: Players, id: PlayerID): Player {
  const player = players.get(id)
  if (player) {
    return player
  } else {
    throw new Error(`Player${id} hasn't been created yet!`)
  }
}

type ClueSummaries = Map<PlayerID, Clue>
export function getClues(players: Players, turnNum: TurnNum): ClueSummaries {
  let clueSummaries: ClueSummaries = new Map();
  for (const player of players.values()) {
    const clue = player.clues.get(turnNum)
    if (typeof clue !== 'undefined') {
      const playerID = player.id
      clueSummaries.set(playerID, clue)
    }
  }
  return clueSummaries
}

export function isSelf(ctx: GameContext, player: Player): boolean {
  if (ctx.self.id === player.id) {
    return true
  } else {
    return false
  }
}

export function renderName(player: Player): string {
  const playerName = player.name
  return playerName ? playerName : `Player${player.id}`
}
