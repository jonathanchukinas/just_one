import { Machine, assign } from 'xstate';
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

const delays = {
  RANDOM_DELAY: () => randFloat(0.5, 2.0),
}


/**************************************
  MACHINE
**************************************/

export const gameMachine = Machine<T.Context, T.States, T.Event>({
  id: 'game',
  initial: 'off',
  states: {
    off: {
      on: {
        TOGGLE: 'on'
      },
      after: {
        delay: 'RANDOM_DELAY',
        target: 'on'
      }
    },
    on: {
      on: {
        TOGGLE: 'off'
      },
      after: {
        delay: 'RANDOM_DELAY',
        target: 'on'
      }
    },
  },
},
{
  guards,
  actions,
  delays,
})
