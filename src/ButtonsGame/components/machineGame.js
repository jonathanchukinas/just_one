import { Machine, assign, spawn } from 'xstate';
import { playerFactory } from './machinePlayer';


const countPendingButtons = playerRefs => {
  const reducer = (total, playerMachine) => {
    // console.log("about to check for pending", playerMachine.context.playerName, playerMachine)
    if (playerMachine.value === 'pending') {
      return total + 1
    } else {
      return total
    }
  }
  console.log('players', playerRefs)
  const count = Object.values(playerRefs).reduce(reducer, 0)
  console.log(count, count)
  return count
}












const buttonsGameMachine = Machine({
  id: 'game',
  context: {
    roundCount: 0,
    players: {
      // Example:
      // 1: {
      //    actorRef: <actorRef>,
      //    ready: true/false,
      // }
    },
  },
  initial: 'idle',
  states: {
    // TODO better name: registration?
    idle: {
      on: {
        START_GAME: 'round',
      }
    },
    round: {
      id: 'newRound',
      entry: 'incrementRoundCount',
      initial: 'playing',
      states: {
        playing: {
          on: {
            READY: {
              target: 'checkingRoundEnd',
              actions: 'updatePlayerReadiness',
            }
          }
        },
        checkingRoundEnd: {
          on: {
            "": [{
              target: '#checkingGameEnd',
              cond: 'areAllPlayersReady',
            },{
              target: 'playing',
            }]
          }
        },
      },
    },
    checkingGameEnd: {
      id: 'checkingGameEnd',
      on: {
        "": [
          {
            target: '#game.endGame',
            cond: 'isEndGame'
          },{
            target: '#newRound'
          },
        ]
      }
    },
    endGame: {
      type: 'final',
    },
  },
  on: {
    ADD_PLAYER: { actions: 'addPlayer' },
  }
},{
  actions: {
    incrementRoundCount: assign({ roundCount: context => context.roundCount + 1 }),
    addPlayer: assign({
      players: context => {
        const existingPlayers = context.players;
        const newPlayerID = `player${Object.keys(existingPlayers).length + 1}`;
        const newPlayerService = spawn(playerFactory(newPlayerID))

        const players = {
          ...existingPlayers,
          [newPlayerID]: newPlayerService
        }
        return players
      }
    }),
    updatePlayerReadiness: assign({
      players: (ctx, e) => {
        const playerID = e.playerID;
        const thisPlayer = ctx.players[playerID]
        thisPlayer.ready = true
        return {
          ...ctx.players,
          [playerID]: thisPlayer
        }
      }
    })
  },
  guards: {
    areAllButtonsComplete: ctx => {
      const playerRefs = ctx.playerRefs
      if (countPendingButtons(playerRefs) == 0) {
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