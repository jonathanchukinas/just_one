import PubSub from 'pubsub-js';
import type { Event, Channel } from './types'

/*

TERMINOLOGY:

pubsub-js uses `message` and `data`.

This wrapper uses `channel` and `event`.

*/


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


export function publish(channel: Channel, event: Event) {
  console.log('Publish! channel:', channel, 'event:', event)
  const message = channelToMessage(channel);
  PubSub.publishSync(message, event)
}
