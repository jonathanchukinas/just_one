import { Machine, assign } from 'xstate';

// TODO naming convention for id?
const buttonsGameMachine = Machine({
  id: 'buttonsGame',
  context: {
    roundNum: 0,
    playerCount: 0,
    finalRoundNum: 3
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        ADD_PLAYER: 'idle',
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
},{
  action: {
    incrementRoundNum: context => (context.roundNum++)
  },
  guards: {
    isEndGame: context => (context.roundNum == context.finalRoundNum),
  }
},  
);

console.log("hello!")