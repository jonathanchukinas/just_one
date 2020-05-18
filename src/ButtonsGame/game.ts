import { Machine, interpret, assign, Interpreter } from 'xstate';
import { subscribe } from './pubsub';
import {
  GameContext,
  GameState,
  GameSchema,
  GameEvent,
  Players,
} from './types';


const gameMachine = Machine<GameContext, GameSchema, GameEvent>({
  id: 'game',
  context: {
    round: 0,
    players: new Map()
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
    })
  },
  guards: {
    isLastRound: (ctx)=>ctx.round === 3,
  }
});


export class Game {

  machine: Interpreter<GameContext, GameSchema, GameEvent>
  observers: Function[]
  previousState: GameState
  
  constructor() {
    this.machine = interpret(gameMachine).start();
    this.observers = [];
    this.previousState = this.state;
    subscribe({ type: 'Game' }, (_: string, event: GameEvent)=>{this.handleEvent(event);})
  }

  handleEvent(event: GameEvent): GameState {
    this.machine.send(event);
    // TODO can these two lines be combined?
    this.notifyObservers();
    return this.state;
  }

  handleMessage(_: string, event: GameEvent) {
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

  get state(): GameState {
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