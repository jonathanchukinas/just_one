import { Game } from './game';
import { v4 as generateUuid } from 'uuid';
import { 
  EventSender,
  Uuid,
  PlayerId,
  Event,
  TurnGetter,
  AddedPlayer,
  GameContext,
  GameSchema,
} from './types';
import { ActionsGenerator } from './actions'


/**
 * Instantiate a game
 * write an eventSender that sends events to the Game
 * Instantiate an Actions with that sender
 * 
 */



const game = new Game();
function eventSender(event: Event) {
  game.handleEvent(event);
};
const actions = new ActionsGenerator(
  eventSender,
  generateUuid(),
  1,
  () => 1
);  
  
  
  
  
it('starts at initial state', () => {
  expect(game.state).toEqual('signIn')
});  
  
// it('add player', () => {
//   actions.
//   expect(game.state).toEqual('signIn')
// });  
