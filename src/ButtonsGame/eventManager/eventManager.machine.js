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

/*

existUnorderedEvents
need guard that checks for existing unordered events

existMissingEvents
need guard to check for missing events

handle incoming confirmed messages
handle new unordered messages
existUnexecutredEvents: 
  check for unexecuted events
  function to send those events to

I should assume in the beginning that this all works well synchronously .
But later may have to do periodic checks to see if any queues have accumulated?
*/




export default eventMgrMachine

// Paste the machine into this page to view:
// https://xstate.js.org/viz/

// The 'lastconfirmed' version of this file is basically a temporary 'save point'. I overwrite it after getting new parts of the machine to work in the visualizer.

