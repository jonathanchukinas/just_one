//
//
//

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


