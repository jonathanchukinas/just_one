import { gameMachine } from './gameMachine'
import { interpret } from 'xstate';
import type {
  GameContext,
  GameSchema,
  GameEvent,
  Player,
  Players,
} from './gameTypes';
import {
  getPlayer,
  getClues,
} from './gameTypes';
import type * as E from './events';


describe('word game', () => {

  // Start the game
  const service = interpret(gameMachine)
  service.start();
  
  test('Check initial state', () => {
    expect(service.state.value).toBe('noPlayers');
  })
    
  test('ADD/NAME_PLAYER', () => {
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
  
  test('SUBMIT_CLUE (Player2)', () => {
    const event: E.SubmitClue = {
      type: 'SUBMIT_CLUE',
      playerID: 2,
      clue: 'bananas'
    }
    const { clue } = event
    const state = service.send(event)
    const { players } = state.context
    const turnNum = 1
    const clues = getClues(players, turnNum)
    expect(clues.get(2)).toBe(clue);
  })
  
  test('submit other (player 3)', () => {
    const event = {
      type: 'SUBMIT',
      playerID: 'player3',
      clue: 'oranges'
    } 
    const state = service.send(event)
    expect(service.state.context.clues[event.playerID]).toBe(event.clue);
    expect(service.state.value).toBe('pendingOthers');
  })

 
  // test('Add player', () => {
  //   expect(service.state.context.status.player4).toBe('active');
  // })

  
})
