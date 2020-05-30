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
} from './types';
import { ActionsGenerator } from './actions'
import { Player } from './player'
import { Machine, MachineConfig, interpret, Interpreter } from 'xstate'
import { game } from '../ButtonsGame/game';


function eventEmitter(event: Event): void {

}


type Observer = (event: Event) => void
const nullObserver = (event: Event) => {}





const gameMachineConfig: MachineConfig<GameContext, GameSchema, Event> = {
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
        SubmittedClue: 'duplicates'
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
}







export class Game {

  private _eventSender: EventSender
  private _gameUuid: Uuid
  private _playerId: PlayerId
  private _observer: Observer
  private _actions: ActionsGenerator
  private _players: Player[]
  private eventHandlers: Object
  private service: Interpreter<GameContext, GameSchema, Event>

  constructor() {
    this._eventSender = eventEmitter;
    this._gameUuid = generateUuid();
    this._playerId = 1;
    this._observer = nullObserver;
    this._actions = new ActionsGenerator(eventEmitter, this._gameUuid, this._playerId, this.turnGetter)
    this._players = [];
    this.eventHandlers = {
      'AddedPlayer': this.handleAddPlayer,
    }
    const machine = Machine(gameMachineConfig)
    this.service = interpret(machine).start();
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

  }

  private handleAddPlayer(event: AddedPlayer) {
    const newPlayer = new Player(event.playerId, event.playerName);
    this._players.push(newPlayer);
    this.service.send(event)
  }

}