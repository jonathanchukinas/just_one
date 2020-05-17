import { Machine, interpret, assign, Interpreter } from 'xstate';
import PubSub from 'pubsub-js';


type GameContext = {
  round: number;
}


type GameSchema = {
  states: {
    round: {},
    endGame: {},
  }
}


type E_EndRound = {
  type: 'END_ROUND',
}

type GameEvent = E_EndRound;


const gameMachine = Machine<GameContext, GameSchema, GameEvent>({
  id: 'game',
  context: {
    round: 0
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


type GameState = {
  round: number,
  isDone: boolean,
}


export class Game {

  machine: Interpreter<GameContext, GameSchema, GameEvent>
  observers: Function[]
  previousState: GameState
  
  constructor() {
    this.machine = interpret(gameMachine).start();
    this.observers = [];
    this.previousState = this.state;
    PubSub.subscribe('Game', (_: string, data: E_EndRound)=>{this.handleEvent(data);})
  }

  handleEvent(event: E_EndRound): GameState {
    this.machine.send(event);
    this.notifyObservers();
    return this.state;
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