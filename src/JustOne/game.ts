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
import { ActionsGenerator } from './actions'
import { Player } from './player'
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
  private _actions: ActionsGenerator
  private _players: Map<PlayerId, Player>
  private state: {
    phase: Phase,
  }
  private turn: TurnHandler


  constructor() {
    this._eventSender = eventEmitter;
    this.turn = new TurnHandler()
    this._gameUuid = generateUuid();
    this._playerId = 1;
    this._observer = nullObserver;
    this._actions = new ActionsGenerator(eventEmitter, this._gameUuid, this._playerId, this.turn.turnGetter)
    this._players = new Map();
    this.state = {
      phase: Phase.Pending,
    }
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

  public handleEvent(event: Event) {
    // TODO handle: 
    //  wrong turn, game
    switch (this.phase) {
      case Phase.Pending:
        if (event.type === 'AddedPlayer') { this.addPlayer(event) }
        if (event.type === 'StartedGame') { this.handleStartGame() }
        break;
      case Phase.Clues:
        if (event.type === 'AddedPlayer') { this.addPlayer(event, PlayerRole.ClueGiver) }
        if (event.type === 'SubmittedClue') { this.handleClue(event) }
        break;
      // case Phase.Dups:
      //   if (event.type === 'AddedPlayer') { this.addPlayer(event) }
      //   if (event.type === 'RejectedDuplicates') { this.handleStartGame() }
      //   break;
      default: 
        throw new Error('Not all Phases are handled yet!')
    }
  }

  private addPlayer(event: AddedPlayer, role: PlayerRole = PlayerRole.Unassigned) {
    const { playerId, playerName } = event;
    const newPlayer = new Player(playerId, playerName, this.turn.turnGetter);
    newPlayer.role = role
    this._players.set(playerId, newPlayer);
  }

  private handleStartGame() {
    this.goToPhase(Phase.Clues)
  }

  private handleClue(event: SubmittedClue) {
    const player = this.getPlayer(event.playerId);
    player.setClue(event);
    const reducer = (isReady: boolean, player: Player) => isReady && player.isCluePhaseReady;
    const areReady = this.players.reduce(reducer, true)
    if (areReady) { this.goToPhase(Phase.Dups) }
  }

  private goToPhase(phase: Phase) {
    this.state.phase = phase;
    if (phase === Phase.Clues) { this.turn.increment() }
  }

  private getPlayer(playerId: PlayerId): Player {
    const player = this._players.get(playerId);
    if (typeof player === 'undefined') {
      throw new Error('Player does not exist') 
    } else {
      return player
    }
  }

  private get players(): Player[] {
    return Array.from(this._players.values())
  }

}