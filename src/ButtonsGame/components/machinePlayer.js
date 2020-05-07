import { Machine, sendParent, assign } from 'xstate';


const playerFactory = playerID => {
  return Machine({
    id: playerID,
    context: {
      playerID: playerID,
      playerName: undefined,
    },
    initial: 'pending',
    states: {
      pending: {
        on: { TOGGLE: 'complete' },
      },
      complete: {
        entry: 'sendReady',
        on: { TOGGLE: 
          {
            target: 'pending',
            actions: 'sendNotReady'
          }
        },
      },
    },
    on: {
      RESET: 'pending',
      // SET_PLAYER_NAME: 'setPlayerName',
    }
  },{
    actions: {
      // TODO can these be abstracted?
      sendReady: context => sendParent({ type: 'READY', playerID: context.playerID }),
      sendNotReady: context => sendParent({ type: 'NOT_READY', playerID: context.playerID }),
      // setPlayerName: assign({
      //   playerName: (_, event) => event.playerName
      // })       
    }
  });
}


export { playerFactory }