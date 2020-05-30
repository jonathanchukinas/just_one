import {
  PlayerId,
  Event,
  Uuid,
  BaseEvent,
  EventSender,
  TurnGetter,
} from './types'
import { v4 as generateUuid } from 'uuid';


export class ActionsGenerator {

  private _eventSender: EventSender
  private _gameUuid: Uuid
  private _playerId: PlayerId
  private _turnNum: TurnGetter

  constructor(
    eventSender: EventSender, 
    gameUuid: Uuid,
    playerId: PlayerId,
    turnGetter: TurnGetter
  ) {
    this._eventSender = eventSender;
    this._gameUuid = gameUuid;
    this._playerId = playerId;
    this._turnNum = turnGetter;
  }

  private getBaseEvent(): BaseEvent {
    return {
      playerId: this._playerId,
      eventUuid: generateUuid(),
      gameUuid: this._gameUuid,
    }
  }

  startGame() {
    const event: Event = {
      type: 'StartedGame',
      ...this.getBaseEvent(),
    }
    this._eventSender(event)
  }

  submitClue(clue: string) {
    const event: Event = {
      type: 'SubmittedClue',
      turnNum: this._turnNum(),
      clue,
      ...this.getBaseEvent(),
    }
    this._eventSender(event)
  }

  rejectDuplicates(duplicates: string[]) {
    const event: Event = {
      type: 'RejectedDuplicates',
      turnNum: this._turnNum(),
      duplicates,
      ...this.getBaseEvent(),
    }
    this._eventSender(event)
  }

  submitGuess(guess: string) {
    const event: Event = {
      type: 'SubmittedGuess',
      turnNum: this._turnNum(),
      guess,
      ...this.getBaseEvent(),
    }
    this._eventSender(event)
  }

  rejectGuess() {
    const event: Event = {
      type: 'RejectedGuess',
      turnNum: this._turnNum(),
      ...this.getBaseEvent(),
    }
    this._eventSender(event)
  }

  skipGuess() {
    const event: Event = {
      type: 'SkippedGuess',
      turnNum: this._turnNum(),
      ...this.getBaseEvent(),
    }
    this._eventSender(event)
  }



}
