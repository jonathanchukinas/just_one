export type Uuid = string;

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
  USER
************************************************/

export interface userIdGetter {
  readonly id: number
}

/************************************************
  PLAYER
************************************************/

export type PlayerId = number;

export enum Role {
  Unassigned,
  ClueGiver,
  ClueLeader,
  Guesser,
}

export enum Connection {
  Active,
  Broken,
}

export interface PlayerState {
  id: PlayerId,
  name: string,
  role: Role,
}

/************************************************
  CLUE, GUESS
************************************************/

export enum Status {
  Pending,
  Accepted,
  Rejected,
}

export interface Clue {
  value: string,
  turnNum: number,
  status: Status,
}

export type Guess = {
  value: string,
  turnNum: number,
  status: Status,
} | {
  turnNum: number,
  status: 'skipped',
}

export type Clues = Map<TurnNum, Clue>
export type Guesses = Map<TurnNum, Guess>

/************************************************
  GAME
************************************************/

export type GameId = number;

export enum Phase {
  Pending,
  Clues,
  Dupls,
  Guess,
  Judge,
  TurnEnd,
}

export interface GameState {
  turnNum: TurnNum,
  phase: Phase,
  players: PlayerState[]
}

/************************************************
  OBSERVER
************************************************/

export type Observer = (gameState: GameState) => void

/************************************************
  TURN
************************************************/

export type TurnNum = number;
export type TurnGetter = () => TurnNum;

/************************************************
  EVENTS
************************************************/

export interface BaseEvent {
  // Client assigns a unique identifier to `uuidEvent`.
  // The server uses it to ensure no duplicate events are added to the event
  // store. The client uses it to match incoming "confirmed" events against a
  // list of sent, but as-yet unconfirmed events.
  eventUuid: Uuid;
  playerId: PlayerId;
  sequenceId?: number; 
};

export interface GameEvent {
  gameId: GameId;
}
export interface TurnEvent {
  turnNum: TurnNum;
}

export interface AddPlayer extends BaseEvent {
  type: 'AddPlayer';
  playerName: string;
}

export interface DisconnectPlayer extends BaseEvent {

  // TODO how to "undisconnect"? AddPlayer? ActivatePlayer?
  type: 'DisconnectPlayer';
}

export interface StartGame extends BaseEvent {
  type: 'StartGame';
}

export interface SubmitClue extends BaseEvent, TurnEvent, GameEvent {
  type: 'SubmitClue';
  clue: string;
}

export interface RejectDups extends BaseEvent, TurnEvent, GameEvent {
  type: 'RejectDups';
  duplicates: string[];
}

export interface SubmitGuess extends BaseEvent, TurnEvent, GameEvent {
  type: 'SubmitGuess';
  guess: string;
}

export interface AcceptGuess extends BaseEvent, TurnEvent, GameEvent {
  type: 'AcceptGuess';
}

export interface RejectGuess extends BaseEvent, TurnEvent, GameEvent {
  type: 'RejectGuess';
}

export interface SkipGuess extends BaseEvent, TurnEvent, GameEvent {
  type: 'SkipGuess';
}

export interface EndGame extends BaseEvent, GameEvent {
  type: 'EndGame';
}

export type Event =
  | AddPlayer
  | DisconnectPlayer
  | StartGame
  | SubmitClue
  | RejectDups
  | SubmitGuess
  | AcceptGuess
  | RejectGuess
  | SkipGuess
  | EndGame

export type EventSender = (event: Event) => void;