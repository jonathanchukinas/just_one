import PubSub from 'pubsub-js'
import Player from './player'


it('print name!', () => {
  const player1 = new Player('Player1');
  PubSub.publish('PRINT_NAME', { mydata: 'data!!!!' })
  expect('hello').toEqual('hello');
});


// it('button machine onToggle', () => {
//   expect(
//     buttonMachine.transition(initialState, 'TOGGLE').value
//     // console.log(initialState.value)
//   ).toEqual('complete');
// });