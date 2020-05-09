// TODO: build machine Factory that accepts player 
// TODO: move types/interfaces to new file
// TODO: test CLUE_WITHDRAW
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
} from './gameTypes'



/**************************************
  ACTIONS
**************************************/

function getTurnNumber(): number {
  return 1
}

const addClue = assign({
  players: (context, e) => {
    const { players } = <GameContext>context;
    const { playerID, value: clue } = <GameEvent>e;
    const player = players[playerID];
    player.clues[getTurnNumber()] = clue;
    return {
      ...players,
      [playerID]: player,
    }
  }
})

const addPlayer = assign({
  players: (ctx, e: GameEvent) => {
    const { players } = <GameContext>ctx;
    let { playerID } = e;
    // TODO can this be replaced by an `||`?
    playerID = playerID ? playerID : Object.keys(players).length + 1;
    const player: Player = {
      connection: ConnectionStatus.Active,
      id: playerID,
      clues: {}
    }
    return {
      ...players,
      [playerID]: player
    }
  }
})

const namePlayer = assign({
  players: (ctx, e: GameEvent) => {
    const { players } = <GameContext>ctx;
    let { playerID, value } = e;
    playerID = playerID ? playerID : Object.keys(players).length + 1;
    const player: Player = {
      connection: ConnectionStatus.Active,
      id: playerID,
      clues: {}
    }
    return {
      ...players,
      [playerID]: player
    }
  }
})

const actions = {
  addClue,
  addPlayer,
  // namePlayer,
}


/**************************************
  GUARDS
**************************************/

const allDone = ctx => {
  const reducer = (areDone, playerID) => {
    return areDone && isPlayerReady(ctx, playerID)
  }
  const playerIDs = Object.keys(ctx.status)
  return playerIDs.reduce(reducer, true)
}

const pendingSelf = ctx => {
  const playerID = ctx.self;
  return !isPlayerReady(ctx, playerID);
}

function isPlayerReady(ctx, playerID) {
  return isClueSubmitted(ctx, playerID) || !isPlayerActive(ctx, playerID)
}

function isPlayerActive(ctx, playerID) {
  if (ctx.status[playerID] === 'active') {
    return true;
  } else {
    return false;
  }
}

function isClueSubmitted(ctx, playerID) {
  const clue = ctx.clues[playerID];
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
    CLUE_SUBMIT: {
      target: '#game',
      actions: 'addClue',
    },
    CLUE_WITHDRAW: {
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