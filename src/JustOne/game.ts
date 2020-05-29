import { v4 as generateUuid } from 'uuid';
import { 
  EventSender,
  Uuid,
  PlayerId,
  Event,
  TurnGetter,
} from './types';
import { EventGenerator } from './eventGenerator'


function eventEmitter(event: Event): void {

}


type Observer = (event: Event) => void
const nullObserver = (event: Event) => {}



export class Game {

  private _eventSender: EventSender
  private _gameUuid: Uuid
  private _playerId: PlayerId
  private _observer: Observer
  private _eventGenerator: EventGenerator

  constructor() {
    this._eventSender = eventEmitter;
    this._gameUuid = generateUuid();
    this._playerId = 1;
    this._observer = nullObserver;
    this._eventGenerator = new EventGenerator(eventEmitter, this._gameUuid, this._playerId, this.turnGetter)
  }

  public get actions(): EventGenerator {
    return this._eventGenerator;
  }

  public registerObserver(observer: Observer): void {
    this._observer = observer;
  }

  private get turnGetter(): TurnGetter {
    return () => 1;
  }

}