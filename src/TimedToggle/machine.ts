import { Machine } from 'xstate';
// import type * as T from './types'


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

// function randFloat(min: number, max: number): number {
//   return Math.random() * (max - min) + min; 
// }

const delays = {
  // RANDOM_DELAY: () => randFloat(0.5, 2.0),
  RANDOM_DELAY: () => 1000,
}


/**************************************
  MACHINE
**************************************/
// TODO
// export const machine = Machine<T.Context, T.States, T.Event>({
export const machine = Machine({
  id: 'game',
  initial: 'off',
  states: {
    off: {
      // on: {
      //   TOGGLE: 'on'
      // },
      after: {1000: 'on'}
    },
    on: {
      // on: {
        //   TOGGLE: 'off'
        // },
      after: {1000: 'off'}
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
  delays,
})
