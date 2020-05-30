import { v4 as generateUuid } from 'uuid';
import { 
  EventSender,
  Uuid,
  PlayerId,
  Event,
  TurnGetter,
  AddedPlayer,
  GameContext,
  Phase,
  StartedGame,
} from './types';
import { ActionsGenerator } from './actions'
import { Player } from './player'
import { Machine, MachineConfig, interpret, Interpreter } from 'xstate'


function eventEmitter(event: Event): void {

}


type Observer = (event: Event) => void
const nullObserver = (event: Event) => {}






export class Game {

  private _eventSender: EventSender
  private _gameUuid: Uuid
  private _playerId: PlayerId
  private _observer: Observer
  private _actions: ActionsGenerator
  private players: Player[]
  private eventHandlers: {[key: string]: Function}
  readonly phase: Phase

  constructor() {
    this._eventSender = eventEmitter;
    this._gameUuid = generateUuid();
    this._playerId = 1;
    this._observer = nullObserver;
    this._actions = new ActionsGenerator(eventEmitter, this._gameUuid, this._playerId, this.turnGetter)
    this.players = [];
    this.eventHandlers = {
      'AddedPlayer': this.handleAddPlayer,
      'StartedGame': this.sendToMachine,
      'SubmittedClue': this.sendToMachine,
    }
    this.phase = Phase.Pending;
  }

  // public get phase(): Phase {
    
  // }

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