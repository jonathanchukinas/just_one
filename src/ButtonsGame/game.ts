import { Machine, interpret, assign, Interpreter } from 'xstate';
import { subscribe } from './pubsub';
import type {
  G_Context,
  G_PublicState,
  G_Schema,
  Event,
  G_Player,
  E_AddPlayer,
} from './types';
// import { playersMap } from './player';


const gameMachine = Machine<G_Context, G_Schema, Event>({
  id: 'game',
  context: {
    round: 0,
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
  
  constructor() {
    this.machine = interpret(gameMachine).start();
    this.observers = [];
    this.previousState = this.state;
    subscribe({ type: 'Game' }, (_: string, event: Event)=>{this.handleEvent(event);})
  }

  handleEvent(event: Event): G_PublicState {
    this.machine.send(event);
    // TODO can these two lines be combined?
    this.notifyObservers();
    return this.state;
  }

  handleMessage(_: string, event: Event) {
    const state = this.handleEvent(event);
    return state; 
  }

  registerObserver(observer: Function): void {
    this.observers.push(observer)
  }

  notifyObservers(): void {
    const newState = this.state;
    if (newState !== this.previousState) {
      this.observers.forEach(observerCallback => { observerCallback(newState) });
      this.previousState = newState;
    }
  }

  get state(): G_PublicState {
    return {
      round: this.machine.state.context.round,
      isDone: (()=>{
        const isDone = this.machine.state.done;
        return (typeof isDone === 'undefined') ? false : isDone
      })()
    }
  }
  
}


export const game = new Game();