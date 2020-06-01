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
  PlayerRole,
} from './types';
import { EventGenerator } from './actions'
import { Player } from './player'
import { Words } from './words'
import { PlayerCollection } from './playerCollection'
import { Turn as TurnHandler } from './turn'


function eventEmitter(event: Event): void {

}


type Observer = (event: Event) => void
const nullObserver = (event: Event) => {}


export class Game {

  private _eventSender: EventSender
  private _gameUuid: Uuid
  private _playerId: PlayerId
  private _observer: Observer
  private _actions: EventGenerator
  private players: PlayerCollection
  private state: {
    phase: Phase,
  }
  private turn: TurnHandler
  private words: Words

  constructor() {
    this._eventSender = eventEmitter;
    this.turn = new TurnHandler()
    this._gameUuid = generateUuid();
    this._playerId = 1;
    this._observer = nullObserver;
    this._actions = new EventGenerator(eventEmitter, this._gameUuid, this._playerId, this.turn.turnGetter)
    this.players = new PlayerCollection(this.turn.turnGetter);
    this.state = {
      phase: Phase.Pending,
    }
    this.words = new Words();
  }

  public get phase(): Phase {
    return this.state.phase; 
  }

  public get actions(): EventGenerator {
    return this._actions;
  }

  public registerObserver(observer: Observer): void {
    this._observer = observer;
  }

  public handleEvent(event: Event) {
    // TODO handle: 
    //  wrong turn, game
    switch (this.phase) {
      case Phase.Pending:
        if (event.type === 'AddedPlayer') { this.players.add(event) }
        if (event.type === 'StartedGame') { this.handleStartGame() }
        break;
      case Phase.Clues:
        if (event.type === 'AddedPlayer') { this.players.add(event, PlayerRole.ClueGiver) }
        if (event.type === 'SubmittedClue') { this.handleClue(event) }
        break;
      case Phase.Dups:
        break;
      case Phase.Guess: 
        break;
      case Phase.Judge:
        break;
      default: 
        throw new Error('Not all Phases are handled yet!')
    }
  }

  private handleStartGame() {
    if (this.players.activePlayerCount >= 4) {
      this.goToPhase(Phase.Clues)
    }
  }

  private handleClue(event: SubmittedClue) {
    const { playerId } = event;
    this.players.get(playerId).setClue(event);
    // console.log('areCluePhaseReady', this.players.areCluePhaseReady)
    if (this.players.areCluePhaseReady) { this.goToPhase(Phase.Dups) }
  }

  private goToPhase(phase: Phase) {
    this.state.phase = phase;
    if (phase === Phase.Clues) {
      this.turn.startNewTurn();
      this.players.startNewTurn();
    }
  }

  get turnGetter(): TurnGetter {
    return this.turn.turnGetter;
  }


}