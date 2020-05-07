const getActivePlayers = ctx => {
  const players = ctx.status;
  const activePlayers = players.filter(player=>{
    player === 'active'
  })
  const activePlayerNames = Object.keys(activePlayers)
  return activePlayerNames
}


const guards = {
  allDone: ()=>{
    // Ignores disconnected players
    return false
  },
  pendingSelf: ()=>{
    // if Self is disconnected, return false
    return false
  },
}

const selfTest = Machine({
  id: 'selfTest',
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
      target: '#selfTest',
      actions: 'addClue',
    },
    WITHDRAW: {
      target: '#selfTest',
      actions: 'deleteClue',
    },
    DISCONNECT: {
      target: '#selfTest',
      actions: 'markDisconnected',
    }
  }
},
{
  guards,
})