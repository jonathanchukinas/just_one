import { gameMachine } from './gameMachine'
import { interpret } from 'xstate';



describe('run an interpreted buttons game', () => {

  // Start the game
  const service = interpret(gameMachine)
  service.start();
  
  test('Check initial state', () => {
    expect(service.state.value).toBe('pendingSelf');
  })

  
})
