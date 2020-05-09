type EventAddPlayer = {
  type: 'ADD_PLAYER';
  id: number;
}

type EventNamePlayer = {
  type: 'NAME_PLAYER';
  name: string;
}



type Event = 
  | EventAddPlayer
  | EventNamePlayer


const event: Event = {
  type: 'ADD_PLAYER',
  id: 1,
}

const hello: Event

function declareEventType(e: Event, type: string) {
  switch (e.type) {
    case type: {
      return e
    }
  }
  throw('This is not possible')
}

function printName(e: Event) {switch (e.type) {case 'NAME_PLAYER': {
  console.log(e.name)
}}}

function sayMyName(e: Event) {
  const event = declareEventType(e, 'NAME_PLAYER')
  console.log(event.name)
}


export type { Event as EitherOfTheseTwo }