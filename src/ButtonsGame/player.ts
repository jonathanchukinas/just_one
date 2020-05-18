import { Machine, interpret, Interpreter } from 'xstate';
import { subscribe, publish } from './pubsub'
import type { 
  P_Context,
  P_Schema,
  Event,
  P_PublicState,
  E_IsReady,
  E_IsNotReady,
  Channel,
  G_Players,
} from './types';


// FIXME can these be made into regular functions at the bottom?
const sendIsReady = function(ctx: P_Context): void {
  const { id } = ctx;
  const channel: Channel = { type: 'Game' };
  const event: E_IsReady = { type: 'IS_READY', id };
  publish(channel, event);
}

// FIXME this one may not be necessary:
// const sendIsNotReady = function(ctx: P_Context): void {
//   const { id } = ctx;
//   const channel: Channel = { type: 'Game' };
//   const event: E_IsNotReady = { type: 'IS_NOT_READY', id };
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
    // actions: {
    //   sendIsReady,
    //   sendIsNotReady,
    // }
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

  get state(): P_PublicState {
    const machineState = this.machine.state;
    const state = {
      ...machineState.context,
      isComplete: (machineState.value === 'complete'),
    };
    return state;
  }

  get isReady(): boolean {
    return this.machine.state.matches('complete');
  }

}


// const players: Player[] = [
//   new Player(1, 'Mary'),
//   new Player(2, 'Jimmy'),
// ]

// const playersMap: G_Players = new Map();
// players.forEach(player => {
//   const id = player.state.id;
//   const player_ = {
//     id,
//     isReady: false,    
//   }
//   playersMap.set(player.state.id, player_)
// })

// export { players, playersMap }
