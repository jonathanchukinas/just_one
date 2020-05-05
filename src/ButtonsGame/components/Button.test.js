import buttonMachine from './machinePlayer';


const { initialState } = buttonMachine;


it('button machine initial state', () => {
  expect(
    initialState.value
    // console.log(initialState.value)
  ).toEqual('incomplete');
});


it('button machine onToggle', () => {
  expect(
    buttonMachine.transition(initialState, 'TOGGLE').value
    // console.log(initialState.value)
  ).toEqual('complete');
});