import { Machine, assign, spawn } from 'xstate';
import buttonMachine from './Button.machine';

// TODO naming convention for id?
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
            cond: 'isFinalRound'
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
    incrementRoundCount: assign({ roundCount: context => context.count + 1 }),
    addPlayer: assign({
      players: (context, event) => {
        const playerName = event.playerName
        const newButtonMachineContext = { playerName }
        const players = context.players.concat({
          [playerName]: spawn(
            buttonMachine.withContext(newButtonMachineContext),
            { sync: true }
          )
        })
        return players
      }
    }),
  },
  guards: {
    areAllButtonsComplete: ctx => {
      ctx.players.keys().forEach(playerRef => {
        const playerMachine = ctx.players[playerRef]
        const playerState = playerMachine.states
        if (playerState != 'complete') { return false}
      })
      return true
    },
    isEndGame: context => (context.roundCount == context.finalRoundNum),
  }
});

export default buttonsGameMachine