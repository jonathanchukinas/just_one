import { v4 as generateUuid } from 'uuid';
import { 
  EventSender,
  Uuid,
  PlayerId,
  Event,
  TurnGetter,
  AddedPlayer,
  Clue, Status,
  Phase,
  StartedGame,
  SubmittedClue,
} from './types';
import { ActionsGenerator } from './actions'
import { Player } from './player'


function eventEmitter(event: Event): void {

}


type Observer = (event: Event) => void
const nullObserver = (event: Event) => {}


export class Game {

  private _eventSender: EventSender
  private _gameUuid: Uuid
  private _playerId: PlayerId
  private _observer: Observer
  private _actions: ActionsGenerator
  private players: Player[]
  private eventHandlers: {[key: string]: Function}
  private state: {
    phase: Phase,
    turnNum: number
  }
  private clues: Clue[]

  constructor() {
    this._eventSender = eventEmitter;
    this._gameUuid = generateUuid();
    this._playerId = 1;
    this._observer = nullObserver;
    this._actions = new ActionsGenerator(eventEmitter, this._gameUuid, this._playerId, this.turnGetter)
    this.players = [];
    this.eventHandlers = {
      'AddedPlayer': this.handleAddPlayer,
      'StartedGame': this.handleStartGame,
      'SubmittedClue': this.handleSubmitClue,
    }
    this.state = {
      phase: Phase.Pending,
      turnNum: 0,
    }
    this.clues = []
  }

  public get phase(): Phase {
    return this.state.phase; 
  }

  public get actions(): ActionsGenerator {
    return this._actions;
  }

  public registerObserver(observer: Observer): void {
    this._observer = observer;
  }

  private get turnGetter(): TurnGetter {
    return () => 1;
  }

  public handleEvent(event: Event) {
    const eventHandler = this.eventHandlers[event.type]
    if (typeof eventHandler === 'undefined') {
      throw new Error(`There is no event handler for ${event.type} yet!`)
    }
    eventHandler.call(this, event)
  }

  private handleAddPlayer(event: AddedPlayer) {
    const newPlayer = new Player(event.playerId, event.playerName);
    this.players.push(newPlayer);
  }

  private handleStartGame(event: StartedGame) {
    this.goToPhase(Phase.Clues)
  }

  private handleSubmitClue(event: SubmittedClue) {
    const newClue: Clue = {
      value: event.clue,
      status: Status.Active,
      turnNum: this.state.turnNum
    };
    this.clues.push(newClue);
    const arePlayersReady = ()=>{
      this.clues.
    }();
    /**
     * add clue
     * check if all players have submitted clues
     * if so, move to next phase
     * else, stay
     */
  }

  private goToPhase(phase: Phase) {
    this.state.phase = phase;
    if (phase === Phase.Clues) { this.state.turnNum = 1 + this.state.turnNum }
  }

}