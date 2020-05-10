import { gameMachine } from './gameMachine'
import { interpret } from 'xstate';
import type {
  GameContext,
  GameSchema,
  GameEvent,
  Player,
  Players,
  PlayerID,
  TurnNum,
} from './gameTypes';
import { getPlayer } from './gameTypes';
import type * as E from './events';


describe('word game', () => {

  // Start the game
  const service = interpret(gameMachine)
  service.start();
  
  test('Check initial state', () => {
    expect(service.state.value).toBe('noPlayers');
  })
    
  test('create players', () => {
    const events: Array<E.AddPlayer|E.NamePlayer> = [
      { type: 'ADD_PLAYER', playerID: 1 },
      { type: 'ADD_PLAYER' },
      { type: 'ADD_PLAYER' },
      { type: 'NAME_PLAYER', playerID: 1, playerName: 'Jonathan' },
      { type: 'NAME_PLAYER', playerID: 3, playerName: 'Nicholas' },
    ]
    service.send(events)
    const nicholas = getPlayer(service.state.context.players, 3)
    expect(nicholas.name).toBe('Nicholas')
  })
  
  // test('submit other (player 2)', () => {
  //   const event = {
  //     type: 'SUBMIT',
  //     playerID: 'player2',
  //     clue: 'bananas'
  //   }
  //   const { playerID, clue } = event
  //   service.send(event)
  //   expect(service.state.context.clues[playerID]).toBe(clue);
  //   expect(service.state.value).toBe('pendingSelf');
  // })
  
  // test('submit self', () => {
  //   const event = {
  //     type: 'SUBMIT',
  //     playerID: 'player1',
  //     clue: 'apples'
  //   } 
  //   const { playerID, clue } = event
  //   service.send(event)
  //   expect(service.state.context.clues[playerID]).toBe(clue);
  //   expect(service.state.value).toBe('pendingOthers');
  // })
  
  // test('submit other (player 3)', () => {
  //   const event = {
  //     type: 'SUBMIT',
  //     playerID: 'player3',
  //     clue: 'oranges'
  //   } 
  //   const state = service.send(event)
  //   expect(service.state.context.clues[event.playerID]).toBe(event.clue);
  //   expect(service.state.value).toBe('pendingOthers');
  // })

 
  // test('Add player', () => {
  //   expect(service.state.context.status.player4).toBe('active');
  // })

  
})
