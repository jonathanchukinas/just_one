import { Machine, assign, spawn } from 'xstate';
import type * as T from './types'


/**************************************
  ACTIONS
**************************************/

const actions = {
}


/**************************************
  GUARDS
**************************************/

const guards = {
}


/**************************************
  DELAYS
**************************************/

function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min; 
}

// const delays = {
//   // RANDOM_DELAY: () => randFloat(0.5, 2.0),
//   RANDOM_DELAY: () => 1000,
// }


/**************************************
  CHILD
**************************************/



const machine = Machine<T.Context, T.States, T.Event>({
  id: 'game',
  initial: 'off',
  states: {
    off: {
      // on: {
      //   TOGGLE: 'on'
      // },
      after: {RANDOM_DELAY: 'on'}
    },
    on: {
      // on: {
        //   TOGGLE: 'off'
        // },
      after: {2000: 'off'}
      // type: 'final',
      // after: [{
      //   delay: 'RANDOM_DELAY',
      //   target: 'on'
      // }]
    },
  },
},
{
  guards,
  actions,
  delays: {
    RANDOM_DELAY: () => {
      const rand = randFloat(250, 10000)
      console.log(rand)
      return rand
    },
  },
})


/**************************************
  PARENT
**************************************/
const parent = Machine({
  id: 'game',
  initial: 'off',
  context: {
    childMachine: null,
  },
  states: {
    spawning: {
      entry: assign({
        childMachine: () => {
          return spawn(child)
        }
      })
    },
    waiting: {},
  },
})


export { parent }