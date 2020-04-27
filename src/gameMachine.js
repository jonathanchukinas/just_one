import { Machine } from 'xstate';

const lightMachine = Machine({
  // Machine identifier
  id: 'light',

  // Initial state
  initial: 'green',

  // Local context for entire machine
  context: {
    elapsed: 0,
    direction: 'east'
  },

  // State definitions
  states: {
    green: {
      /* ... */
    },
    yellow: {
      /* ... */
    },
    red: {
      /* ... */
    }
  }
});

// https://xstate.js.org/viz/?gist=80b957256a3cd46c411d946dd6e8fff7
