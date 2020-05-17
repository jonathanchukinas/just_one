import { Game } from './game';
import PubSub from 'pubsub-js';


it('increments correctly', () => {
  const game = new Game();
  expect(game.getRoundNumber()).toEqual(1);
  const event = {
    type: 'END_ROUND'
  }
  PubSub.publishSync('Game', event);
  expect(game.getRoundNumber()).toEqual(2);
  PubSub.publishSync('Game', event);
  expect(game.getRoundNumber()).toEqual(3);
  PubSub.publishSync('Game', event);
  expect(game.machine.state.done).toBeTruthy();
});  
