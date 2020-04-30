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