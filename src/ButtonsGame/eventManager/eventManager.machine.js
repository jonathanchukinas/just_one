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
                        {target: 'yes'},
                        {target: 'no'},
                      ],
                    }
                  },
                  yes: {},
                  no: {
                    id: 'noUnorderedEvents',
                    type: 'final',
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
                    type: 'final',
                  },
                },
            },
          },
          onDone: {target: '#syncComplete'},
        },
        syncComplete: {
          id: 'syncComplete',
          activities: [ 'pollingServer' ],
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
  activities: {
    pollingServer: ACTIVITY_pollingServer,
  },
  guards: {
  },
});


function ACTIVITY_pollingServer() {
  const msg = 'Polling server for new events'
  const interval = setInterval(() => console.log(msg), 5000);
  return () => clearInterval(interval);
}




export default eventMgrMachine

// Paste the machine into this page to view:
// https://xstate.js.org/viz/

// The 'lastconfirmed' version of this file is basically a temporary 'save point'. I overwrite it after getting new parts of the machine to work in the visualizer.

