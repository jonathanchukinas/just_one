
export type PlayerID = number;

/************************************************
  EVENTS
************************************************/

export type E_AddPlayer = {
  type: 'ADD_PLAYER',
  id: PlayerID,
  name?: string
}

export type E_EndRound = {
  type: 'END_ROUND',
}

export type E_Toggle = {
  type: 'TOGGLE'
}

// Player signals that they are ready to move 
// to next phase.
export type E_IsReady = {
  type: 'IS_READY',
  // FIXME this may not be needed:
  id: PlayerID,
}

// Player signals that they are not ready to move 
// to next phase.
export type E_IsNotReady = {
  type: 'IS_NOT_READY',
  id: PlayerID,
};

export type Event =
  | E_AddPlayer
  | E_EndRound
  | E_Toggle
  | E_IsReady
  | E_IsNotReady

/************************************************
  PUBSUB
************************************************/

export type Channel =
  // | { type: 'Global' }
  | { type: 'Game' | 'AllPlayers' }
  | { type: 'Player', id: PlayerID }

/************************************************
  PLAYER
************************************************/

export type P_Context = {
  name: string,
  id: PlayerID,
};

export type P_Schema = {
  states: {
    incomplete: {},
    complete: {},
  }
};

export interface P_PublicState extends P_Context {
  isReady: boolean,
};

/************************************************
  GAME MACHINE
************************************************/

// FIXME this could be confused with the Player Class
export type G_Player = {
  id: PlayerID,
  isReady: boolean,
  clue?: string,
}

export type G_Players = Map<PlayerID, G_Player>

export type G_Context = {
  round: number,
  players: G_Players,
};

export type G_Schema = {
  states: {
    round: {},
    endGame: {},
  }
};

export type G_PublicState = {
  round: number,
  isDone: boolean,
  playerState: P_PublicState[],
}

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
