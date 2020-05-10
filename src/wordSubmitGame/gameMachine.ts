// TODO: build machine Factory that accepts player 
// TODO: move types/interfaces to new file
// TODO: test CLUE.WITHDRAW
// TODO: test DISCONNECT
// TODO: test RECONNECT
// TODO: finish
// TODO: typescript
// TODO: set context clues to undefined on start


import { Machine, assign } from 'xstate';
import type {
  GameContext,
  GameSchema,
  GameEvent,
  Player,
  Players,
  PlayerID,
  TurnNum,
} from './gameTypes'
import {
  ConnectionStatus,  
} from './gameTypes'
import type * as E from './events'



/**************************************
  general
**************************************/

function getPlayer(players: Players, id: PlayerID): Player {
  const player = players.get(id)
  if (player) {
    return player
  } else {
    throw(`Player${id} hasn't been created yet!`)
  }
}


/**************************************
  ACTIONS
**************************************/

function getTurnNumber(): TurnNum {
  return 1
}

const addClue = assign({
  players: (ctx: GameContext, e) => {
    const { players } = ctx;
    const { playerID, clue } = <E.SubmitClue>e;
    const turnNum = getTurnNumber();
    players.get(playerID)?.clues.set(turnNum, clue)
    return players
  }
})

const addPlayer = assign({
  players: (ctx: GameContext, e) => {
    const { players } = ctx;
    let { playerID } = <E.AddPlayer>e;
    if (!playerID) { playerID = players.size };
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
    const { playerID, playerName } = <E.NamePlayer>e;
    getPlayer(players, playerID).name = playerName
    return players
  }
})

const actions = {
  addClue,
  addPlayer,
  namePlayer,
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
  if (!self) { return false }
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

const gameMachine = Machine<GameContext, GameSchema, GameEvent>({
  id: 'game',
  initial: 'noPlayers',
  context: {
    turnNumber: 1,
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
      target: '#game',
      actions: 'addPlayer',
    },
    NAME_PLAYER: {
      actions: 'namePlayer',
    },
    SUBMIT_CLUE: {
      target: '#game',
      actions: 'addClue',
    },
    WITHDRAW_CLUE: {
      target: '#game',
      actions: 'deleteClue',
    },
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


export { gameMachine }