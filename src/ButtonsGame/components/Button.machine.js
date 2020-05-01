import { Machine } from 'xstate';

const buttonMachine = Machine({
  id: 'button',
  context: {
    isSelf: false,
  },
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


export default buttonMachine
