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


const game = new Game();
function eventSender(event: Event) {
  game.handleEvent(event);
};
const actions = new ActionsGenerator(
  eventSender,
  generateUuid(),
  1,
  game.turnGetter,
);  
  

  
  
it('initial state', () => {
  expect(game.phase).toEqual(Phase.Pending)
});  
  
it('add player', () => {
  actions.addPlayer('Maria');
  expect(game.phase).toEqual(Phase.Pending)
});  
  
it('start game', () => {
  actions.startGame();
  expect(game.phase).toEqual(Phase.Clues)
});  
  
it('submit clue', () => {
  actions.submitClue('carpet');
  expect(game.phase).toEqual(Phase.Dups)
});  
  
// it('reject dups', () => {
//   actions.rejectDuplicates(['carpet']);
//   expect(game.state).toEqual('duplicates')
// });  
