import PubSub from 'pubsub-js';
import type { GameEvent } from './game'

/*

TERMINOLOGY:

pubsub-js uses `message` and `data`.

This wrapper uses `channel` and `event`.

*/


type Channel =
  | { type: 'Game' | 'AllPlayers' }
  | { type: 'Player', id: number }


function channelToMessage(channel: Channel): string {
  if (channel.type === 'Player') {
    return 'Player' + channel.id;
  }
  return channel.type;
}


export function subscribe(channel: Channel, callback: Function) {
  const message = channelToMessage(channel);
  PubSub.subscribe(message, callback)
}


export function publish(channel: Channel, event: GameEvent) {
  const message = channelToMessage(channel);
  PubSub.publishSync(message, event)
}
