import { gameMachine } from './gameMachine'
import { interpret } from 'xstate';



describe('run an interpreted buttons game', () => {

  // Start the game
  const service = interpret(gameMachine)
  service.start();
  
  test('Check initial state', () => {
    expect(service.state.value).toBe('pendingSelf');
  })
    
  test('create players', () => {
    const state = service.send('ADD_PLAYER')
    expect(state.context.status.player4).toBe('active')
  })
  
  test('submit other (player 2)', () => {
    const event = {
      type: 'SUBMIT',
      playerID: 'player2',
      clue: 'bananas'
    }
    const { playerID, clue } = event
    service.send(event)
    expect(service.state.context.clues[playerID]).toBe(clue);
    expect(service.state.value).toBe('pendingSelf');
  })
  
  test('submit self', () => {
    const event = {
      type: 'SUBMIT',
      playerID: 'player1',
      clue: 'apples'
    } 
    const { playerID, clue } = event
    service.send(event)
    expect(service.state.context.clues[playerID]).toBe(clue);
    expect(service.state.value).toBe('pendingOthers');
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