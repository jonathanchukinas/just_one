import { Machine, interpret, assign } from 'xstate';
import PubSub from 'pubsub-js';


const gameMachine = Machine({
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

  constructor() {
    this.machine = interpret(gameMachine).start();
    PubSub.subscribe('Game', (_, data)=>{this.handleEvent(data);})
  }

  handleEvent(event) {
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
