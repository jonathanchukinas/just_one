import { Machine, assign } from 'xstate';


const eventMgrMachine = Machine({
  id: 'eventMachine',
  context: {
    eventStore: {
      unconfirmed: [],
      confirmed: [],
    },
    lastExecutedEventID: undefined,
  },
  type: 'parallel',
  states: {
    syncStatus: {
      initial: 'syncInProgress',
      states: {
        syncInProgress: {
          type: 'parallel',
          states: {
            existUnorderedEvents: {
              initial: 'unk',
                states: {
                  unk: {
                    on: {
                      '': [
                        { target: 'yes', cond: 'areUnorderedEvents' },
                        { target: 'no' },
                      ],
                    },
                  },
                  yes: {},
                  no: {
                    id: 'noUnorderedEvents',
                    on: {
                      '': {
                        target: '#syncComplete',
                        in: '#noMissingEvents',
                      }
                    }
                  },
                },
            },
            existMissingEvents: {
              initial: 'unk',
                states: {
                  unk: {},
                  yes: {},
                  no: {
                    id: 'noMissingEvents',
                    on: {
                      '': {
                        target: '#syncComplete',
                        in: '#noMissingEvents',
                      }
                    }
                  },
                },
            },
          },
        },
        syncComplete: {
          id: 'syncComplete'
        },
      },
    },
    existUnexecutedEvents: {
      initial: 'unk',
      states: {
        unk: {},
        yes: {},
        no: {},
      },
    },
  },
},{
  actions: {
  },
  guards: {
    
  },
});





export default eventMgrMachine

// Paste the machine into this page to view:
// https://xstate.js.org/viz/

// The 'lastconfirmed' version of this file is basically a temporary 'save point'. I overwrite it after getting new parts of the machine to work in the visualizer.

