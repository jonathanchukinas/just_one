import { Machine } from 'xstate';


function buttonMachineFactory(playerName, isSelf, playerID) {

  return Machine({
    id: 'button',
    context: {
      playerName: playerName,
      isSelf: isSelf,
      playerID: playerID,
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

}



export default buttonMachineFactory
