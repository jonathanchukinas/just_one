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

/**
 * (Note: this is for a simplified no-rooms version)
 * User navigates to page (e.g. www.chukinas.com/justone)
 * page looks for player UUID
 * If none found, a new one is generated.
 * User enters name (e.g. "Maria")
 * Spin up websocket (generates a connection ID)
 * On connect, client sends AddPlayer event (incl. name, uuid; but missing playerID)
 * Server re-broadcasts event with playerID (new if new uuid, existing if existing uuid)
 * 
 * Server tracks ALL uuids and their (dis)connection status
 * Only when ALL uuids are disconnected are all uuids deleted and event store erased.
 * 
 * On disconnect, server must broadcast disconnect event.
 * Like all other events, this one must be saves to the event store.
 * 
 * How to start a new game?
 * For now, it'd be good enough to re-use the StartGame event.
 * This would only work during the Pending phase.
 * Perhaps later there can be a ForceRestart that would work anytime.
 * Either way, the event stores would store ALL events, even for past games.
 * Or maybe even better would be an EndGame event that can be triggered anytime.
 * This takes you back to Pending phase, where you're free to start a new game.
 * 
 * Where in this scheme does the server have to alter/create events?
 */
  

  
  
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
