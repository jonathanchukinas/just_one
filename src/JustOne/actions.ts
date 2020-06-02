import {
  PlayerId,
  Event,
  Uuid,
  BaseEvent,
  EventSender,
  TurnGetter,
} from './types'
import { v4 as generateUuid } from 'uuid';


export class EventGenerator {

  private eventSender: EventSender
  private _gameUuid: Uuid
  private _playerId: PlayerId
  private _turnNum: TurnGetter

  constructor(
    eventSender: EventSender, 
    gameUuid: Uuid,
    playerId: PlayerId,
    turnGetter: TurnGetter
  ) {
    this.eventSender = eventSender;
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

  addPlayer(playerName: string) {
    const event: Event = {
      type: 'AddPlayer',
      playerName,
      ...this.getBaseEvent(),
    }
    this.eventSender(event)
  }

  startGame() {
    const event: Event = {
      type: 'StartGame',
      ...this.getBaseEvent(),
    }
    this.eventSender(event)
  }

  submitClue(clue: string) {
    const event: Event = {
      type: 'SubmitClue',
      turnNum: this._turnNum(),
      clue,
      ...this.getBaseEvent(),
    }
    this.eventSender(event)
  }

  rejectDuplicates(duplicates: string[]) {
    const event: Event = {
      type: 'RejectDups',
      turnNum: this._turnNum(),
      duplicates,
      ...this.getBaseEvent(),
    }
    this.eventSender(event)
  }

  submitGuess(guess: string) {
    const event: Event = {
      type: 'SubmitGuess',
      turnNum: this._turnNum(),
      guess,
      ...this.getBaseEvent(),
    }
    this.eventSender(event)
  }

  rejectGuess() {
    const event: Event = {
      type: 'RejectGuess',
      turnNum: this._turnNum(),
      ...this.getBaseEvent(),
    }
    this.eventSender(event)
  }

  skipGuess() {
    const event: Event = {
      type: 'SkipGuess',
      turnNum: this._turnNum(),
      ...this.getBaseEvent(),
    }
    this.eventSender(event)
  }



}
