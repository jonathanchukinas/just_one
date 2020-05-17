import { Machine, interpret, assign, MachineConfig, Interpreter } from 'xstate';
import PubSub from 'pubsub-js';


type GameContext = {
  round: number;
}


type GameSchema = {
  states: {
    round: {},
    endGame: {},
  }
}


type E_EndRound = {
  type: 'END_ROUND',
}

type GameEvent = E_EndRound;


const gameMachine = Machine<GameContext, GameSchema, GameEvent>({
  id: 'game',
  context: {
    round: 0
  },
  initial: 'round',
  states: {
    round: {
      entry: 'incrementRound',
      on: {
        END_ROUND: [{
          target: 'endGame',
          cond: 'isLastRound',
        },{
          target: 'round',
          internal: false,
        }]
      }
    },
    endGame: {
      type: 'final',
    },
  },
},{
  actions: {
    incrementRound: assign({
      round: (ctx) => ctx.round + 1
    })
  },
  guards: {
    isLastRound: (ctx)=>ctx.round==3,
  }
});



export class Game {
  
  id: number
  machine: Interpreter<GameContext, GameSchema, GameEvent>
  
  constructor() {
    this.id = 1;
    this.machine = interpret(gameMachine).start();
    PubSub.subscribe('Game', (_: string, data: E_EndRound)=>{this.handleEvent(data);})
  }

  handleEvent(event: E_EndRound) {
    this.machine.send(event)
  }

  getState() {
    const state = this.machine.state.value;
    console.log(state);
    return state;
  }

  getRoundNumber() {
    return this.machine.state.context.round;
  }

}
