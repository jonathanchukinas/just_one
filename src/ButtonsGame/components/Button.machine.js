import { Machine, sendParent } from 'xstate';


export default Machine({
  id: 'button',
  context: {
    playerName: undefined,
    // isSelf: isSelf,
    // playerID: playerID,
  },
  initial: 'pending',
  states: {
    pending: {
      on: { TOGGLE: 'complete' },
    },
    complete: {
      on: { TOGGLE: 'pending' },
      entry: 'checkRoundEnd'
    },
  },
  on: { RESET: 'pending' }
},{
  actions: {
    checkRoundEnd: sendParent('CHECK_ROUND_END')
  }
});
