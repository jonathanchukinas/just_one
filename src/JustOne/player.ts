import {
  PlayerId,
  Event,
  Uuid,
  BaseEvent,
  EventSender,
  TurnGetter,
} from './types'



export class Player {

  constructor(readonly id: PlayerId, readonly name: string) {}


}