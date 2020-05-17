
/************************************************
  EVENTS
************************************************/

export type E_EndRound = {
  type: 'END_ROUND',
}

/************************************************
  GAME
************************************************/

export type GameContext = {
  round: number;
}

export type GameState = {
  round: number,
  isDone: boolean,
}

export type GameSchema = {
  states: {
    round: {},
    endGame: {},
  }
}

export type GameEvent = E_EndRound;

/************************************************
  PLAYER
************************************************/


/************************************************
  Future Only
************************************************/


interface Flavoring<FlavorT> {
  _type?: FlavorT;
};
type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;
// TODO maybe: use a simple alias instead. At this point, because there are no
// mutually-exclusive aliases of string, there's nothing this flavored type can
// do that a simple alias doesn't already do...
type uuid = Flavor<string, "UniqueIdentifier">;


export interface gameEvent {
  // `type` is the all-caps strings used by the state machine to transition 
  // from state to state.
  type: string;
  // `idPlayer` is the player's number. 
  // It is generated server-side anew each game, and corresponds to the order
  // in which he joined the game.
  // TODO maybe: an idPlayer of `0` would represent a game event generated by 
  // the server. 
  idPlayer: number;
}


// `meta` contains the metadata needed by client and server for syncing,
// and feeding events to the right game in the right order.
export interface socketMessage {
  // `idChrono` is a number assigned by the server.
  // It is the order this event was received by the server.
  // It's optional because when the event is generated by the client,
  // there is no id yet, only a uuid.
  idChrono?: number; 
  // Client assigns a unique identifier to `uuidEvent`.
  // The server uses it to ensure no duplicate events are added to the event
  // store. The client uses it to match incoming "confirmed" events against a
  // list of sent, but as-yet unconfirmed events.
  uuid: uuid;
  // `uuidGame` is important b/c if the client is disconnected long enough, 
  // he might rejoin once a new game is started. We don't want an event from an
  // old game accidentally being sent to a game with a completely new context.
  uuidGame: uuid;
  // `event` is the object ultimately passed into the game's machine interpreter.
  // When rehydrating a game, all that's needed is a list of these objects 
  // sorted in chronological order.
  event: gameEvent;
};