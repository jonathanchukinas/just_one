import { Machine, sendParent } from 'xstate';
import { assign } from 'xstate/lib/actionTypes';


const playerFactory = playerID => {
  Machine({
    id: 'player',
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
      SET_PLAYER_NAME: 'setPlayerName',
    }
  },{
    actions: {
      sendReady: sendParent('READY'),
      sendNotReady: sendParent('NOT_READY'),
      setPlayerName: assign({
        playerName: (context, event) => event.playerName
      })
       
    }
  });
}


export { playerFactory }