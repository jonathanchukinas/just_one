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
  Phase,
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
  

  
  
it('initial state', () => {
  expect(game.phase).toEqual(Phase.Pending)
});  
  
// it('add player', () => {
//   actions.addPlayer('Maria');
//   expect(game.state).toEqual('awaitingStartGame')
// });  
  
// it('start game', () => {
//   actions.startGame();
//   expect(game.state).toEqual('clues')
// });  
  
// it('submit clue', () => {
//   actions.submitClue('carpet');
//   expect(game.state).toEqual('duplicates')
// });  
  
// it('reject dups', () => {
//   actions.rejectDuplicates(['carpet']);
//   expect(game.state).toEqual('duplicates')
// });  
