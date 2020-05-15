import { Machine, interpret } from 'xstate';
import PubSub from "pubsub-js"


const machine = Machine({
  id: 'player1',
  initial: 'incomplete',
  states: {
    incomplete: {
      on: {
        TOGGLE: 'complete'
      },
    },
    complete: {
      on: {
        TOGGLE: 'incomplete'
      },
    },
  }
});


class Player {

  constructor (id) {
    // this.machine = interpret(machine);
    this.id = id;
    this.name = 'Mary';
    const printName = (msg, data) => {
      console.log(msg, data)
    };
    PubSub.subscribe('PRINT_NAME', printName);
  }

  // printName(msg, data) {
  //   console.log(this.name, msg, data)
  // }


}


export default Player