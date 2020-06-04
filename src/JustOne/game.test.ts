import { Game } from './game';
import { v4 as generateUuid } from 'uuid';
import { 
  EventSender,
  Uuid,
  PlayerId,
  Event,
  Phase,
} from './types';
import { EventGenerator } from './actions'


const game = new Game();
function eventSender(event: Event) {
  game.handleEvent(event);
};


const playerNames = [
  'Maria',
  'James',
  'Austin',
  'Nicholas',
  'Jonathan',
  'Kristina',
  'Mollie',
]
const players: EventGenerator[] = playerNames.map((name, index) => {
  return new EventGenerator(
    eventSender,
    generateUuid(),
    index + 1,
    game.turnGetter,
  );
})

const words = [
  'water',
  'boy',
  'idea',
  'lift',
  'comfort',
  'toys',
  'silver',
];


// const players: EventGenerator[] = []
// for (let playerId = 1; playerId <= 7; playerId++ ) {
//   const player = new EventGenerator(
//     eventSender,
//     generateUuid(),
//     playerId,
//     game.turnGetter,
//   );
// }

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
  
  
it('Pending', () => {
  expect(game.state.phase).toEqual(Phase.Pending)
});  
  
it('Pending -> Clues', () => {
  players[1].addPlayer('Maria');
  players[1].startGame();
  expect(game.state.phase).toEqual(Phase.Pending)
  players[2].addPlayer('James');
  players[2].startGame();
  expect(game.state.phase).toEqual(Phase.Pending)
  players[3].addPlayer('Austin');
  players[3].startGame();
  expect(game.state.phase).toEqual(Phase.Pending)
  players[4].addPlayer('Nicholas');
  players[4].startGame();
  // console.log(game.state)
  expect(game.state.phase).toEqual(Phase.Clues)
});
  
it('Clues -> Dups', () => {
  // players[1].submitClue('carpet');
  players[2].submitClue('carpet');
  players[3].submitClue('carpet');
  expect(game.state.phase).toEqual(Phase.Clues)
  players[4].submitClue('carpet');
  expect(game.state.phase).toEqual(Phase.Dupls);
});  
  
it('Dups -> Guess', () => {
  players[2].rejectDuplicates(['carpet']);
  expect(game.state.phase).toEqual(Phase.Guess);
});  
  
it('Guess -> Judge', () => {
  console.log(game.state)
  players[1].submitGuess('Arabia');
  expect(game.state.phase).toEqual(Phase.Judge);
});  
  
it('Judge -> End Turn', () => {
  players[2].rejectGuess();
  expect(game.state.phase).toEqual(Phase.TurnEnd);
});  
