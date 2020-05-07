import buttonsGameMachine from './machineGame';
import { interpret } from 'xstate';


describe('run an interpreted buttons game', () => {

  // Start the game
  const service = interpret(buttonsGameMachine)
  // TODO can I tack .start() onto the above line instead?
  service.start();
  const state = service.state;
  
  test('Begin in idle', () => {
    expect(service.state.value).toBe('idle');
    expect(service.state.context.roundCount).toBe(0);
    expect(state.context.roundCount).toBe(0);
  })
  
  test('Start game', () => {
    service.send('START_GAME')
    expect(state.matches('idle')).toBe(true);
    expect(service.state.matches('round')).toBe(true);
  })
  
})
