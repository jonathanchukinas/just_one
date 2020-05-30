import { v4 as generateUuid } from 'uuid';
import { 
  EventSender,
  Uuid,
  PlayerId,
  Event,
  TurnGetter,
  AddedPlayer,
  GameContext,
  GameSchema,
  StartedGame,
} from './types';
import { ActionsGenerator } from './actions'
import { Player } from './player'
import { Machine, MachineConfig, interpret, Interpreter } from 'xstate'


function eventEmitter(event: Event): void {

}


type Observer = (event: Event) => void
const nullObserver = (event: Event) => {}





const gameMachine = Machine<GameContext, GameSchema, Event>({
  id: 'game',
  initial: "signIn",
  states: {
    signIn: {
      on: {
        AddedPlayer: 'awaitingStartGame',
      }
    },
    awaitingStartGame: {
      on: {
        StartedGame: 'startGame'
      }
    },
    startGame: {
      on: {
        '': 'startTurn'
      }
    },
    startTurn: {
      on: {
        '': 'clues'
      }
    },
    clues: {
      on: {
        SubmittedClue: {
          target: 'checkCluesComplete',
          cond: 'tsra'
        }
      }
    },
    checkCluesComplete: {
      on: {
        '': [
          {
            target: 'duplicates',
            cond: 'areCluesComplete'
          },{
            target: 'clues'
          }
        ]
      }
    },
    duplicates: {
      on: {
        RejectedDuplicates: 'guess'
      }
    },
    guess: {
      on: {
        SubmittedGuess: 'judge',
        SkippedGuess: 'endTurn',
      }
    },
    judge: {
      on: {
        RejectedGuess: 'endTurn',
        AcceptedGuess: 'endTurn',
      }
    },
    endTurn: {
      on: {
        '': [
          'endGame',
          'startTurn',
        ]
      }
    },
    endGame: {
      type: 'final'
    }
  }
})







export class Game {

  private _eventSender: EventSender
  private _gameUuid: Uuid
  private _playerId: PlayerId
  private _observer: Observer
  private _actions: ActionsGenerator
  private players: Player[]
  private eventHandlers: {[key: string]: Function}
  private service: Interpreter<GameContext, GameSchema, Event>

  constructor() {
    this._eventSender = eventEmitter;
    this._gameUuid = generateUuid();
    this._playerId = 1;
    this._observer = nullObserver;
    this._actions = new ActionsGenerator(eventEmitter, this._gameUuid, this._playerId, this.turnGetter)
    this.players = [];
    this.eventHandlers = {
      'AddedPlayer': this.sendToMachine,
      'StartedGame': this.sendToMachine,
      'SubmittedClue': this.sendToMachine,
    }
    // const machine = Machine(gameMachineConfig)
    this.service = interpret(gameMachine).start();
  }

  public get state(): string {
    // console.log(this.service.state.value)
    const state = this.service.state.value;
    if (typeof state === 'string') {
      return state
    } else {
      throw new Error('Game state should always be a string')
    }
  }

  public get actions(): ActionsGenerator {
    return this._actions;
  }

  public registerObserver(observer: Observer): void {
    this._observer = observer;
  }

  private get turnGetter(): TurnGetter {
    return () => 1;
  }

  public handleEvent(event: Event) {
    const eventHandler = this.eventHandlers[event.type]
    if (typeof eventHandler === 'undefined') {
      throw new Error(`There is no event handler for ${event.type} yet!`)
    }
    eventHandler.call(this, event)
  }

  private handleAddPlayer(event: AddedPlayer) {
    const newPlayer = new Player(event.playerId, event.playerName);
    this.players.push(newPlayer);
    this.sendToMachine(event)
  }

  private sendToMachine(event: Event) {
    this.service.send(event)
  }

}