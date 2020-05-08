// TODO: addClue
// TODO: guard allDone
// TODO: guard pendingSelf
// TODO: typescript
// TODO: addPlayer


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
  allDone: ()=>{
    // TODO Ignores disconnected players
    return false
  },
  pendingSelf: ()=>{
    // TODO if Self is disconnected, return false
    return true;
  },
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
      player3: 'inactive',
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