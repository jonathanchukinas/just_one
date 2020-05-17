import { Machine, interpret } from 'xstate';
import PubSub from 'pubsub-js';



const gameMachine = Machine({
  id: 'game',
  initial: 'round1',
  states: {
    round1: {
      on: {
        END_ROUND: 'round2',
      }
    },
    round2: {
      on: {
        END_ROUND: 'round3',
      }
    },
    round3: {
      on: {
        END_ROUND: 'endGame',
      }
    },
    endGame: {
      type: 'final',
    },
  },
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

}
