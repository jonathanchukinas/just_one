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
  PlayerIndex,
} from './gameTypes'
import {
  ConnectionStatus,  
} from './gameTypes'
import type * as E from './events'



/**************************************
  ACTIONS
**************************************/

function getTurnNumber(): number {
  return 1
}

const addClue = assign({
  players: (ctx: GameContext, e) => {
    const { players } = ctx;
    const { playerIndex, clue } = <E.SubmitClue>e;
    const player = players[playerIndex];
    player.clues[getTurnNumber()] = clue;
    players[playerIndex] = player
    return players
  }
})

const addPlayer = assign({
  players: (ctx: GameContext, e) => {
    const { players } = ctx;
    let { playerIndex } = <E.AddPlayer>e;
    if (!playerIndex) { playerIndex = Object.keys(players).length }
    const player: Player = {
      connection: ConnectionStatus.Active,
      index: playerIndex,
      clues: {}
    }
    players[playerIndex] = 
    return {
      ...players,
      [PlayerIndex]: player
    }
  }
})

const namePlayer = assign({
  players: (ctx: GameContext, e) => {
    const { players } = ctx;
    let { PlayerIndex, playerName } = <E.NamePlayer>e;
    PlayerIndex = PlayerIndex ? PlayerIndex : Object.keys(players).length + 1;
    const player: Player = {
      connection: ConnectionStatus.Active,
      index: PlayerIndex,
      clues: {},
      name: playerName,
    }
    return {
      ...players,
      [PlayerIndex]: player
    }
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

const allDone = (ctx: GameContext) => {
  function reducer(areDone: boolean, id: PlayerIndex): boolean {
    return areDone && isPlayerReady(ctx, id)
  }
  const PlayerIndexs: PlayerIndex[] = Object.keys(ctx.players)
  return PlayerIndexs.reduce(reducer, true)
}

const pendingSelf = (ctx: GameContext) => {
  const PlayerIndex = ctx.self;
  return !isPlayerReady(ctx, PlayerIndex);
}

function isPlayerReady(ctx: GameContext, id: PlayerIndex) {
  return isClueSubmitted(ctx, id) || !isPlayerActive(ctx, id)
}

function isPlayerActive(ctx: GameContext, id: PlayerIndex) {
  if (ctx.status[id] === 'active') {
    return true;
  } else {
    return false;
  }
}

function isClueSubmitted(ctx, PlayerIndex) {
  const clue = ctx.clues[PlayerIndex];
  // TODO replace undefined with a null class
  if (typeof clue === 'undefined') {
    return false
  } else {
    return true
  }
}

const guards = {
  allDone,
  pendingSelf,
}


/**************************************
  MACHINE
**************************************/

const gameMachine = Machine<GameContext, GameSchema, GameEvent>({
  id: 'game',
  initial: 'unknown',
  context: {
    self: 1,
    turnNumber: 1,
    players: {},
  },
  states: {
    unknown: {
      on: {
        '': [
          {
            target: 'done',
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
    PLAYER_ADD: {
      actions: 'addPlayer',
    },
    PLAYER_NAME: {
      actions: 'namePlayer',
    },
    CLUE.SUBMIT: {
      target: '#game',
      actions: 'addClue',
    },
    CLUE.WITHDRAW: {
      target: '#game',
      actions: 'deleteClue',
    },
    DISCONNECT: {
      target: '#game',
      actions: 'markDisconnected',
    }
  }
},
{
  guards,
  actions,
})


export { gameMachine }