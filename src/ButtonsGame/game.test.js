import buttonsGameMachine from './game';
import { interpret } from 'xstate';
import PubSub from 'pubsub-js'


class Game {
  constructor() {
    this.count = 0;
  }
  increment() {
    this.count++;
    console.log('count:', this.count);
  }
}


it('increments correctly', () => {
  const game = new Game();
  expect(game.count).toEqual(0);
  game.increment();
  expect(game.count).toEqual(1);  
});  
