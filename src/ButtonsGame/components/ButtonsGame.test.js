import buttonsGameMachine from './ButtonsGame.machine';
import { interpret } from 'xstate';


describe('test buttons game transitions', () => {

  const { initialState } = buttonsGameMachine;

  test('initial state', () => {
    expect(initialState.value).toEqual('idle');
  });  
  
  test('START_GAME', () => {
    const turn1 = buttonsGameMachine.transition(initialState, 'START_GAME');
    expect(turn1.value).toEqual('playRound');
  });

});


describe('run an interpreted buttons game', () => {

  // Start the game
  const buttonsGameService = interpret(buttonsGameMachine)
  buttonsGameService.start();
  
  test('Advance to Turn 1', () => {
    const turn1 = buttonsGameService.send('START_GAME');
    expect(turn1.value).toBe('playRound');
    expect(turn1.context.roundNum).toEqual(1);
  })

  test('Advance to Turn 2', () => {
    const turn2 = buttonsGameService.send('END_ROUND');
    expect(turn2.context.roundNum).toEqual(2);
  })

  test('Advance to Turn 3', () => {
    const turn3 = buttonsGameService.send('END_ROUND');
    expect(turn3.context.roundNum).toEqual(3);
  })

  test('End Game', () => {
    const endGameState = buttonsGameService.send('END_ROUND');
    expect(endGameState.done).toBe(true);
  })
  
})
