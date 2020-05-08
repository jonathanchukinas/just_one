// TODO: addClue
// TODO: guard allDone
// TODO: guard pendingSelf
// TODO: typescript
// TODO: addPlayer
// TODO: set context clues to undefined on start


import { Machine, assign } from 'xstate';


const getActivePlayers = ctx => {
  const players = ctx.status;
  const activePlayers = players.filter(player=>{
    player === 'active'
  })
  const activePlayerNames = Object.keys(activePlayers)
  return activePlayerNames
}


const actions = {
  addClue: assign({
    clues: (ctx, e) => {
      const { clues } = ctx
      const { clue, playerID } = e
      return {
        ...clues,
        [playerID]: clue,
      }
    }
  })
}


const guards = {
  allDone: ctx => {
    const reducer = (areDone, playerID) => {
      return areDone && isPlayerReady(ctx, playerID)
    }
    const playerIDs = Object.keys(ctx.status)
    return playerIDs.reduce(reducer, true)
  },
  pendingSelf: ctx => {
    const playerID = ctx.self;
    return !isPlayerReady(ctx, playerID);
  },
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


function areCluesDone(ctx, playerIDs) {
  playerIDs.forEach(playerID => {
    const clue = ctx.clues[playerID];
    if (typeof clue === 'undefined') {
      return false
    }
  })
  return true
}


const gameMachine = Machine({
  id: 'game',
  initial: 'unknown',
  context: {
    self: 'player1',
    clues: {
      player1: undefined,
      player2: undefined,
      player3: undefined,
    },
    status: {
      player1: 'active',
      player2: 'active',
      player3: 'active',
    },
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
            target: 'pendingOthers',
          },
        ],
      },
    },
    done: {
      type: 'final',
    },
    pendingSelf: {},
    pendingOthers: {},
  },
  on: {
    SUBMIT: {
      target: '#game',
      actions: 'addClue',
    },
    WITHDRAW: {
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