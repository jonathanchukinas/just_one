import {
  PlayerId,
  Event,
  Uuid,
  BaseEvent,
} from './types'
import { v4 as generateUuid } from 'uuid';


type EventEmitter = (event: Event) => void;


export class EventGenerator {

  private eventEmitter: EventEmitter
  private gameUuid: Uuid
  private playerId: PlayerId

  constructor(eventEmitter: EventEmitter, gameUuid: Uuid,  playerId: PlayerId) {
    this.eventEmitter = eventEmitter;
    this.gameUuid = gameUuid;
    this.playerId = playerId;
  }


  private getBaseEvent(): BaseEvent {
    return {
      playerId: this.playerId,
      eventUuid: generateUuid(),
      gameUuid: this.gameUuid,
    }
  }

  startGame() {
    const event: Event = {
      type: 'StartedGame',
      ...this.getBaseEvent(),
    }
    this.eventEmitter(event)
  }

  submitClue(turnNum: number, clue: string) {
    const event: Event = {
      type: 'SubmittedClue',
      turnNum,
      clue,
      ...this.getBaseEvent(),
    }
    this.eventEmitter(event)
  }

  rejectDuplicates(turnNum: number, duplicates: string[]) {
    const event: Event = {
      type: 'RejectedDuplicates',
      turnNum,
      duplicates,
      ...this.getBaseEvent(),
    }
    this.eventEmitter(event)
  }

  submitGuess(turnNum: number, guess: string) {
    const event: Event = {
      type: 'SubmittedGuess',
      turnNum,
      guess,
      ...this.getBaseEvent(),
    }
    this.eventEmitter(event)
  }

  rejectGuess(turnNum: number) {
    const event: Event = {
      type: 'RejectedGuess',
      turnNum,
      ...this.getBaseEvent(),
    }
    this.eventEmitter(event)
  }

  skipGuess(turnNum: number) {
    const event: Event = {
      type: 'SkippedGuess',
      turnNum,
      ...this.getBaseEvent(),
    }
    this.eventEmitter(event)
  }



}
