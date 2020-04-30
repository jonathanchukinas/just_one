import buttonsGameMachine from './ButtonsGame.machine';
import { interpret } from 'xstate';


const { initialState } = buttonsGameMachine;


test('buttons game machine initial state', () => {
  expect(
    initialState.value
  ).toEqual('idle');
});


test('button machine onToggle', () => {
  expect(
    buttonsGameMachine.transition(initialState, 'START_GAME').value
  ).toEqual('playRound');
});


test('buttons game machine, interpreted', () => {

  // Start the game
  const buttonsGameService = interpret(buttonsGameMachine)
  buttonsGameService.start();
  const turn1 = buttonsGameService.send('START_GAME');

  // Turn 1
  expect(turn1.value).toBe('playRound');
  expect(turn1.context.roundNum).toEqual(1);
  
  // Turn 2
  const turn2 = buttonsGameService.send('END_ROUND');
  expect(turn2.context.roundNum).toEqual(2);
  
  // Turn 3
  const turn3 = buttonsGameService.send('END_ROUND');
  expect(turn3.context.roundNum).toEqual(3);

  // End Game
  const endGameState = buttonsGameService.send('END_ROUND');
  expect(endGameState.done).toBe(true);
  
})
