import { Machine, assign } from 'xstate';
import type {
  GameContext,
  GameSchema,
  GameEvent,
  Player,
} from './gameTypes'
import type {
  TurnNum,
} from './simpleTypes'
import {
  ConnectionStatus, 
  getPlayer, 
} from './gameTypes'
import type * as E from './events'


/**************************************
  ACTIONS
**************************************/

function getTurnNumber(): TurnNum {
  return 1
}

const addClue = assign({
  players: (ctx: GameContext, e) => {
    const { players } = ctx;
    const { playerID, clue } = e as E.SubmitClue;
    const turnNum = getTurnNumber();
    players.get(playerID)?.clues.set(turnNum, clue)
    return players
  }
})

const addPlayer = assign({
  players: (ctx: GameContext, e) => {
    const { players } = ctx;
    let { playerID } = e as E.AddPlayer;
    if (!playerID) { playerID = players.size + 1 };
    players.set(playerID, {
      connection: ConnectionStatus.Active,
      id: playerID,
      clues: new Map(),
    });
    return players
  }
})

const namePlayer = assign({
  players: (ctx: GameContext, e) => {
    const { players } = ctx;
    const { playerID, playerName } = e as E.NamePlayer;
    getPlayer(players, playerID).name = playerName
    return players
  }
})

const setSelf = assign({
  self: (ctx: GameContext, e) => {
    const { players } = ctx;
    const { playerID } = e as E.SetSelf;
    const self = getPlayer(players, playerID)
    return self
  }
})

const actions = {
  addClue,
  addPlayer,
  namePlayer,
  setSelf,
}


/**************************************
  GUARDS
**************************************/

const isCluePhaseComplete = (ctx: GameContext) => {
  for (const player of ctx.players.values()) {
    if (!isReady(player)) { return false }
  }
  return true
}

function amIHoldingUpCluePhase(ctx: GameContext): boolean {
  const self = ctx.self
  if (self.id === null) { return false }
  return !isReady(self);
}

function isReady(player: Player) {
  return hasClue(player, getTurnNumber()) || !isActive(player)
}

function isActive(player: Player): boolean {
  return (player.connection === ConnectionStatus.Active)
}

function hasClue(player: Player, turnNum: TurnNum): boolean {
  return player.clues.has(turnNum)
}

const guards = {
  allDone: isCluePhaseComplete,
  pendingSelf: amIHoldingUpCluePhase,
}


/**************************************
  MACHINE
**************************************/

export const gameMachine = Machine<GameContext, GameSchema, GameEvent>({
  id: 'game',
  initial: 'noPlayers',
  context: {
    self: { id: null },
    turnNum: 1,
    players: new Map(),
  },
  states: {
    noPlayers: {},
    unknown: {
      on: {
        '': [
          {
            target: 'complete',
            cond: 'allDone',
          },
          {
            target: 'pendingSelf',
            cond: 'pendingSelf',
          },
          {
            target: 'pendingOthers',
          },
        ],
      },
    },
    complete: {
      type: 'final',
    },
    pendingSelf: {},
    pendingOthers: {},
  },
  on: {
    ADD_PLAYER: {
      target: 'unknown',
      actions: 'addPlayer',
    },
    NAME_PLAYER: {
      actions: 'namePlayer',
    },
    SET_SELF: {
      target: 'unknown',
      actions: 'setSelf',
    },
    SUBMIT_CLUE: {
      target: 'unknown',
      actions: 'addClue',
    },
    // WITHDRAW_CLUE: {
    //   target: 'unknown',
    //   actions: 'deleteClue',
    // },
    // DISCONNECT: {
    //   target: '#game',
    //   actions: 'markDisconnected',
    // }
  }
},
{
  guards,
  actions,
})
