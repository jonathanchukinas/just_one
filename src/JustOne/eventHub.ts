import {
  PlayerId,
  Event,
  Uuid,
  BaseEvent,
  EventSender,
  TurnGetter,
} from './types'
import { v4 as generateUuid } from 'uuid';


export class EventHub {

  private _eventsQueue: Event[];
  private _nextSequenceId: number;

  constructor() {
    this._eventsQueue = [];
    this._nextSequenceId = 0;
  }

  public getNext(): Event {
    // Error handling?
    const sequenceId = this._nextSequenceId;
    this._nextSequenceId += 1;
    return this._eventsQueue[sequenceId];
  }

  public get(sequenceId: number): Event {
    // Error handling?
    return this._eventsQueue[sequenceId];
  }

  public emitEvent(event: Event): void {
    // Later, this will actually sync the event to the database
    this._eventsQueue.push(event);
  }




}
