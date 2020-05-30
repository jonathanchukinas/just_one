
export type PlayerId = number;
export type TurnNum = number;
export type Uuid = string;

/************************************************
  EVENTS
************************************************/

export interface BaseEvent {
  // `idPlayer` is the player's number. 
  // It is generated server-side anew each game, and corresponds to the order
  // in which he joined the game.
  // TODO maybe: an idPlayer of `0` would represent a game event generated by 
  // the server. 
  playerId: PlayerId;
  // Client assigns a unique identifier to `uuidEvent`.
  // The server uses it to ensure no duplicate events are added to the event
  // store. The client uses it to match incoming "confirmed" events against a
  // list of sent, but as-yet unconfirmed events.
  eventUuid: Uuid;
  // `uuidGame` is important b/c if the client is disconnected long enough, 
  // he might rejoin once a new game is started. We don't want an event from an
  // old game accidentally being sent to a game with a completely new context.
  gameUuid: Uuid;
  // `idChrono` is a number assigned by the server.
  // It is the order this event was received by the server.
  // It's optional because when the event is generated by the client,
  // there is no id yet, only a uuid.
  sequenceId?: number; 
};

interface TurnEvent {
  turnNum: number;
}

export interface AddedPlayer extends BaseEvent {
  type: 'AddedPlayer';
  playerName: string;
}

export interface StartedGame extends BaseEvent {
  type: 'StartedGame';
}

export interface SubmittedClue extends BaseEvent, TurnEvent {
  type: 'SubmittedClue';
  clue: string;
}

export interface RejectedDuplicates extends BaseEvent, TurnEvent {
  type: 'RejectedDuplicates';
  duplicates: string[];
}

export interface SubmittedGuess extends BaseEvent, TurnEvent {
  type: 'SubmittedGuess';
  guess: string;
}

export interface AcceptedGuess extends BaseEvent, TurnEvent {
  type: 'AcceptedGuess';
}

export interface RejectedGuess extends BaseEvent, TurnEvent {
  type: 'RejectedGuess';
}

export interface SkippedGuess extends BaseEvent, TurnEvent {
  type: 'SkippedGuess';
}


export type Event =
  | AddedPlayer
  | StartedGame
  | SubmittedClue
  | RejectedDuplicates
  | SubmittedGuess
  | AcceptedGuess
  | RejectedGuess
  | SkippedGuess
  // | {type: ''}

export type EventSender = (event: Event) => void;
export type TurnGetter = () => TurnNum;

/************************************************
  PUBSUB
************************************************/

export type Channel =
  // | { type: 'Global' }
  | { type: 'Game' | 'AllPlayers' }
  | { type: 'Player', id: PlayerId }


/************************************************
  CARD
************************************************/

export enum CardState {
  Unplayed,
  Guessed,
  Skipped,
  Wrong,
  WrongCasualty,
}

export type T_Card = {
  word: string,
  status: CardState,
  turn?: number,
}

/************************************************
  PLAYER
************************************************/

interface Player {
  id: number,
  name: string,
}

/************************************************
  CLUE
************************************************/

enum ClueStatus {
  Active,
  Rejected,
}

interface Clue {
  value: string,
  status: ClueStatus,
  turnNum: number,
}

/************************************************
  GAME
************************************************/

export type G_Player = {
  id: PlayerId,
  isReady: boolean,
  clue?: string,
}

export type G_Players = Map<PlayerId, G_Player>

export type G_Context = {
  round: number,
};

export type G_Schema = {
  states: {
    round: {},
    endGame: {},
  }
};

export type G_PublicState = {
  turnNumber: number,
  isGameRunning: boolean,
  phase: Phase,
  cards: CardState[],
}

export enum Phase {
  Pending,
  Clues,
  Dups,
  Guess,
  Judge,
}

export interface GameContext {
  turnNum: number,
  clues: Clue[],
  players: Player[],
}