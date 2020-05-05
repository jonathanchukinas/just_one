import { Machine, assign, spawn } from 'xstate';
import buttonMachine from './Button.machine';


const countPendingButtons = players => {
  const reducer = (total, playerMachine) => {
    // console.log("about to check for pending", playerMachine.context.playerName, playerMachine)
    if (playerMachine.value === 'pending') {
      return total + 1
    } else {
      return total
    }
  }
  console.log('players', players)
  const count = Object.values(players).reduce(reducer, 0)
  console.log(count, count)
  return count
}


const buttonsGameMachine = Machine({
  id: 'game',
  context: {
    roundCount: 0,
    players: {},
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        START_GAME: 'round',
      }
    },
    round: {
      entry: 'incrementRoundCount',
      on: {
        CHECK_ROUND_END: {
          target: 'resolution',
          cond: 'areAllButtonsComplete'
        }
      }
    },
    resolution: {
      on: {
        "": [
          {
            target: 'endGame',
            cond: 'isEndGame'
          },{
            target: 'round'
          },
        ]
      }
    },
    endGame: {
      type: 'final',
    },
  },
  on: {
    ADD_PLAYER: {
      actions: 'addPlayer',
    },
  }
},{
  actions: {
    incrementRoundCount: assign({ roundCount: context => context.roundCount + 1 }),
    addPlayer: assign({
      players: (context, event) => {
        const playerName = event.playerName
        const initialContext = { playerName }
        const players = {
          ...context.players,
          [playerName]: spawn(
            buttonMachine.withContext(initialContext),
            { sync: true }
          ),
        }
        return players
      }
    }),
  },
  guards: {
    areAllButtonsComplete: ctx => {
      const players = ctx.players
      if (countPendingButtons(players) == 0) {
        console.log("All buttons are complete. Next round!")
        return true
      } else {
        console.log("Some buttons are still pending")
        return false
      }      
    },
    isEndGame: context => (context.roundCount === context.finalRoundNum),
  }
});

export default buttonsGameMachine