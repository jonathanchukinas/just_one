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
    },
    on: {
      on: {
        TOGGLE: 'off'
      },
    },
  },
},
{
  guards,
  actions,
})
