import { 
  GameId,
  PlayerId,
  Event,
  TurnGetter,
  Phase,
  Observer,
  SubmittedClue,
  PlayerRole,
} from './types';
import { Words } from './words'
import { PlayerCollection } from './playerCollection'
import { Turn as TurnHandler } from './turn'

const nullObserver = (event: Event) => {}


export class Game {

  private gameId: GameId
  private observer: Observer
  private players: PlayerCollection
  private _phase: Phase
  private turn: TurnHandler
  private words: Words

  constructor(readonly playerId: PlayerId) {
    this.turn = new TurnHandler()
    this.players = new PlayerCollection(this.turn.turnGetter);
    this.words = new Words();
    this.gameId = 0;
    this.observer = nullObserver;
    this._phase = Phase.Pending
  }

  public get phase(): Phase {
    return this._phase; 
  }

  public registerObserver(observer: Observer): void {
    this.observer = observer;
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
      this.gameId++
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
    this._phase = phase;
    if (phase === Phase.Clues) {
      this.turn.startNewTurn();
      this.players.startNewTurn();
    }
  }

  get turnGetter(): TurnGetter {
    return this.turn.turnGetter;
  }

}