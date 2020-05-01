import { Machine } from 'xstate';


function buttonMachineFactory(playerName, isSelf) {

  return Machine({
    id: 'button',
    context: {
      playerName: playerName,
      isSelf: isSelf,
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
