import { Machine, interpret, Interpreter, MachineConfig } from 'xstate';
import { subscribe, publish } from './pubsub'
import { 
  PlayerContext,
  PlayerSchema,
  PlayerState,
  E_IsReady,
  E_IsNotReady,
  Channel,
} from './types';


// TODO can these be made into regular functions at the bottom?
const sendIsReady = function(ctx: PlayerContext): void {
  const { id } = ctx;
  const channel: Channel = { type: 'Game' };
  const event: E_IsReady = { type: 'IS_READY', id };
  publish(channel, event);
}

const sendIsNotReady = function(ctx: PlayerContext): void {
  const { id } = ctx;
  const channel: Channel = { type: 'Game' };
  const event: E_IsNotReady = { type: 'IS_NOT_READY', id };
  publish(channel, event);
}


function playerMachineFactory(id: number, name: string) {
  const playerMachine = Machine<PlayerContext, PlayerSchema, Event>({
    id: 'player',
    context: {
      id,
      name,
    },
    initial: 'incomplete',
    states: {
      incomplete: {
        on: {
          TOGGLE: 'complete'
        },
        entry: 'sendIsNotReady',
      },
      complete: {
        on: {
          TOGGLE: 'incomplete'
        },
        entry: 'sendIsReady',
      },
    }
  },{
    actions: {
      sendIsReady,
      sendIsNotReady,
    }
  })
  return playerMachine
}


export class Player {

  machine: Interpreter<PlayerContext, PlayerSchema, Event>
  observers: Function[]
  previousState: PlayerState

  constructor(id: number, name: string) {
    const machine = playerMachineFactory(id, name);
    this.machine = interpret(machine).start();
    this.observers = [];
    this.previousState = this.state;
    subscribe({ type: 'Game' }, (_: string, event: Event)=>{this.handleMessage(event);})
  }

  handleMessage(event: Event) {
    // FIXME repeat this pattern in the game
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

  get state(): PlayerState {
    const machineState = this.machine.state;
    const state = {
      ...machineState.context,
      isComplete: (machineState.value === 'complete'),
    };
    return state;
  }

}


export const player: Player[] = [
  new Player(1, 'Mary'),
  new Player(2, 'Jimmy'),
]