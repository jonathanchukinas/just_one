import { Machine, interpret } from 'xstate';
import PubSub from "pubsub-js"


const playerMachine = Machine({
  id: 'player',
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


  constructor () {
  }

}


export default Player