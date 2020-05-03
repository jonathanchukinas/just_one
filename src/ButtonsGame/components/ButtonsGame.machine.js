import { Machine, assign } from 'xstate';

// TODO naming convention for id?
const buttonsGameMachine = Machine({
  id: 'buttonsGame',
  context: {
    roundNum: 0,
    playerCount: 0,
    finalRoundNum: 3,
    playerNames: [],
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        START_GAME: 'playRound',
      }
    },
    playRound: {
      entry: 'incrementRoundNum',
      on: {
        END_ROUND: [
          { target: 'endGame', cond: 'isEndGame' },
          { target: 'playRound' },
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
    incrementRoundNum: context => context.roundNum++,
    addPlayer: assign((context, event)=>{
      console.log('Player added!', event.playerName)
      const { playerNames } = context
      playerNames.push(event.playerName)
      return {
        ...context,
        playerNames: playerNames,
      }
    }),
  },
  guards: {
    isEndGame: context => (context.roundNum == context.finalRoundNum),
  }
});

export default buttonsGameMachine