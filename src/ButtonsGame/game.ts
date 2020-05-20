import { Machine, interpret, assign, Interpreter } from 'xstate';
import { subscribe } from './pubsub';
import type {
  G_Context,
  G_PublicState,
  G_Schema,
  Event,
  G_Player,
  E_AddPlayer,
  PlayerID,
  E_EndRound,
  P_PublicState,
} from './types';
import { Player } from './player';


const gameMachine = Machine<G_Context, G_Schema, Event>({
  id: 'game',
  context: {
    round: 0,
    // FIXME remove this
    players: new Map(),
  },
  initial: 'round',
  states: {
    round: {
      entry: 'incrementRound',
      on: {
        END_ROUND: [{
          target: 'endGame',
          cond: 'isLastRound',
        },{
          target: 'round',
          internal: false,
        }]
      }
    },
    endGame: {
      type: 'final',
    },
  },
},{
  actions: {
    incrementRound: assign({
      round: (ctx) => ctx.round + 1
    }),
    // FIXME remove this
    addPlayer: assign({
      players: (ctx, e) => {
        const { players } = ctx;
        const { id } = e as E_AddPlayer;
        const newPlayer: G_Player = { id, isReady: false }
        players.set(id, newPlayer);
        return players
      }
    })
  },
  guards: {
    isLastRound: (ctx)=>ctx.round === 3,
  }
});


export class Game {

  machine: Interpreter<G_Context, G_Schema, Event>
  observers: Function[]
  previousState: G_PublicState
  playerStates: P_PublicState[]
  
  constructor() {
    this.machine = interpret(gameMachine).start();
    this.observers = [];
    this.previousState = this.state;
    this.playerStates = [];
    this.addPlayer({
      type: 'ADD_PLAYER',
      id: 1,
      name: 'Mary'
    })
    this.addPlayer({
      type: 'ADD_PLAYER',
      id: 2,
      name: 'Jake'
    })
    subscribe({ type: 'Game' }, (_: string, event: Event)=>{this.handleEvent(event);})
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case 'ADD_PLAYER': 
        this.addPlayer(event);
        break;
      case 'IS_READY':
        this.checkForReady();
        break;
    }
    this.machine.send(event);
    // TODO can these two lines be combined?
    this.notifyObservers();
  }

  handleMessage(_: string, event: Event) {
    const state = this.handleEvent(event);
    return state; 
  }

  registerObserver(observer: Function): void {
    // FIXME code duplication. Inheritance?
    this.observers.push(observer);
    this.notifyObservers();
  }

  notifyObservers(): void {
    const newState = this.state;
    if (newState !== this.previousState) {
      this.observers.forEach(observerCallback => { observerCallback(newState) });
      this.previousState = newState;
      console.log('game state change!', newState)
    }
  }

  get state(): G_PublicState {
    return {      
      round: this.machine.state.context.round,
      isDone: (()=>{
        const isDone = this.machine.state.done;
        return (typeof isDone === 'undefined') ? false : isDone
      })(),
      playerState: this.playerStates,
    }
  }

  addPlayer(event: E_AddPlayer): void {
    const { id, name } = event;
    const playerObserver = this.getPlayerObserver(id);
    const newPlayer = new Player(id, name ? name : 'Billy Bob');
    newPlayer.registerObserver(playerObserver);
  }

  checkForReady(): void {
    const playerPublicStates = Array.from(this.playerStates.values());
    playerPublicStates.forEach(playerPublicState => {
      if (!playerPublicState.isReady) { return }
    })
    const event: E_EndRound = { type: 'END_ROUND' }
    this.machine.send(event)
  }

  // FIXME how to set this private?
  getPlayerObserver(id: PlayerID): (playerState: P_PublicState)=>void {
    const playerIndex: number = id - 1;
    // FIXME do I need this intermediate var?
    const game = this;
    const playerStates = this.playerStates;
    // const notify = this.notifyObservers;
    function playerObserver(playerState: P_PublicState) {
      playerStates[playerIndex] = playerState;
      // notify();
      game.notifyObservers();
    };
    return playerObserver;
  }
  
}


export const game = new Game();