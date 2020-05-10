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

function getTurnNumber(): number {
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

const allDone = (ctx: GameContext) => {
  function reducer(areDone: boolean, id: PlayerID): boolean {
    return areDone && isPlayerReady(ctx, id)
  }
  const PlayerIndexs: PlayerID[] = Object.keys(ctx.players)
  return PlayerIndexs.reduce(reducer, true)
}

const pendingSelf = (ctx: GameContext) => {
  const PlayerIndex = ctx.self;
  return !isPlayerReady(ctx, PlayerIndex);
}

function isPlayerReady(ctx: GameContext, id: PlayerID) {
  return isClueSubmitted(ctx, id) || !isPlayerActive(ctx, id)
}

function isPlayerActive(ctx: GameContext, id: PlayerID) {
  const player = ctx.players.get(id)
  if (!player) { throw(`Player hasn't been created yet!`)}
  return (player.connection === ConnectionStatus.Active)
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
    players: new Map(),
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