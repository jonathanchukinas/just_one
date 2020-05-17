import { Game } from './game';
import PubSub from 'pubsub-js';


it('increments correctly', () => {
  const game = new Game();
  expect(game.getState()).toEqual('round1');
  const event = {
    type: 'END_ROUND'
  }
  PubSub.publishSync('Game', event);
  expect(game.getState()).toEqual('round2');
  PubSub.publishSync('Game', event);
  expect(game.getState()).toEqual('round3');
  PubSub.publishSync('Game', event);
  expect(game.machine.state.done).toBeTruthy();
});  
