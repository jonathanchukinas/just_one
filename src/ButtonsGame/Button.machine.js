import { Machine } from 'xstate';

const buttonMachine = Machine({
  id: 'button',
  initial: 'incomplete',
  states: {
    incomplete: {
      on: {
        TOGGLE: 'complete'
      }
    },
    complete: {
      on: {
        TOGGLE: 'incomplete'
      },
      type: 'final'
    },
  }
});


export default buttonMachine
