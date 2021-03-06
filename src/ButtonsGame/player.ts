import { Machine, interpret, Interpreter } from 'xstate';
import { subscribe } from './pubsub'
import type { 
  P_Context,
  P_Schema,
  Event,
  P_PublicState,
  Channel,
} from './types';
// FIXME reduce import size?
import * as _ from 'lodash';


// FIXME can these be made into regular functions at the bottom?
// const sendIsReady = function(ctx: P_Context): void {
//   const { id } = ctx;
//   const channel: Channel = { type: 'Game' };
//   const event: E_IsReady = { type: 'IS_READY', id };
//   publish(channel, event);
// }


function playerMachineFactory(id: number, name: string) {
  const playerMachine = Machine<P_Context, P_Schema, Event>({
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
      },
      complete: {
        on: {
          TOGGLE: 'incomplete'
        },
        // entry: 'sendIsReady',
      },
    },
    on: {
      RESET: '.incomplete'
    }
  })
  return playerMachine
}



export class Player {

  machine: Interpreter<P_Context, P_Schema, Event>
  observers: Function[]
  previousState: P_PublicState

  constructor(id: number, name: string) {
    const machine = playerMachineFactory(id, name);
    this.machine = interpret(machine).start();
    this.observers = [];
    this.previousState = this.state;
    const subscribedChannels: Channel[] = [
      { type: 'Player', id },
      { type: 'AllPlayers' },
    ]
    subscribedChannels.forEach(channel=>{
      subscribe(channel, (_: string, event: Event)=>{this.handleMessage(event);})
    });
  }

  handleMessage(event: Event) {
    // FIXME repeat this pattern in the game
    console.log('Player', this.machine.state.context.id, 'Before:', event, this.state)
    this.machine.send(event);
    this.notifyObservers(true);
    console.log('Player', this.machine.state.context.id, 'After:', event, this.state)
  }

  registerObserver(observer: Function): void {
    // FIXME maybe only allow one observer?
    this.observers.push(observer);
    this.notifyObservers(true);
  }

  notifyObservers(force: boolean = false): void {
    const newState = this.state;
    if (force || !_.isEqual(newState, this.previousState)) {
      this.observers.forEach(observerCallback => { observerCallback(newState) });
      this.previousState = newState;
    }
  }

  get state(): P_PublicState {
    const machineState = this.machine.state;
    const state = {
      ...machineState.context,
      isReady: this.machine.state.matches('complete'),
    };
    return state;
  }

}
