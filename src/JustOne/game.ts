import { 
  GameId,
  PlayerId,
  Event,
  Phase,
  Observer,
  SubmitClue,
  AddPlayer,
  RejectDups,
  SubmitGuess,
  SkipGuess,
  GameState,
  TurnGetter,
} from './types';
import { Words } from './words'
import { PlayerCollection } from './playerCollection'
import { Turn as TurnHandler } from './turn'


type PermittedPhase = Phase | 'AnyPhase';
type EventType = Event['type'];
type EventHandler = (event: Event)=>void;
type Pattern = [PermittedPhase, EventType, EventHandler]
const nullHandler: EventHandler = ()=> {}
const nullObserver = (gameState: GameState) => {}


export class Game {

  private gameId: GameId
  private observer: Observer
  private players: PlayerCollection
  private _phase: Phase
  private turn: TurnHandler
  private words: Words

  constructor() {
    this.turn = new TurnHandler()
    this.players = new PlayerCollection(this.turn.turnGetter);
    this.words = new Words();
    this.gameId = 0;
    this.observer = nullObserver;
    this._phase = Phase.Pending
  }

  /************************************************
   OBSERVER & STATE
  ************************************************/

  get state(): GameState {
    return {
      turnNum: this.turn.get(),
      phase: this._phase,
      players: this.players.getState()
    }
  }

  registerObserver(observer: Observer): void {
    this.observer = observer;
  }
  
  private notifyObserver() {
    this.observer(this.state)
  }

  get turnGetter(): TurnGetter {
    return this.turn.turnGetter;
  }

  /************************************************
    EVENT ROUTING
  ************************************************/

  handleEvent(event: Event) {
    // console.log(event)
    if (this.isGameInSync(event) && this.isTurnInSync(event)) {
      const eventHandler = this.getEventHandler(event);
      // console.log(eventHandler)
      eventHandler(event);
      this.notifyObserver();
    }
  }

  private isGameInSync(event: Event) {
    if ('gameId' in event) {
      return event.gameId === this.gameId;
    } else {
      return true;
    }
  }

  private isTurnInSync(event: Event) {
    if ('turnNum' in event) {
      return event.turnNum === this.turn.get();
    } else {
      return true;
    }
  }

  private getEventHandler(event: Event): EventHandler {
    const patterns: Pattern[] = [
      ['AnyPhase', 'AddPlayer', this.addPlayer],
      ['AnyPhase', 'DisconnectPlayer', this.disconnectPlayer],
      ['AnyPhase', 'EndGame', this.endGame],
      [Phase.Pending, 'StartGame', this.startGame],
      [Phase.Clues, 'SubmitClue', this.submitClue],
      [Phase.Dupls, "RejectDups", this.rejectDups],
      [Phase.Guess, 'SubmitGuess', this.submitGuess],
      [Phase.Guess, 'SkipGuess', this.skipGuess],
      [Phase.Judge, 'AcceptGuess', this.acceptGuess],
      [Phase.Judge, 'RejectGuess', this.rejectGuess],
    ]    
    let eventHandler = nullHandler;
    for (const [phase, type, handler] of patterns) {
      // console.log("phase in [this._phase, 'AnyPhase']", [this._phase, 'AnyPhase'].includes(phase))
      // console.log("phase", phase)
      if ([this._phase, 'AnyPhase'].includes(phase) && type === event.type) {
        eventHandler = handler;
        break;
      }
    }
    return eventHandler.bind(this);
  }

  /************************************************
    FSM ENTRY ACTIONS
  ************************************************/

  private goToPhase(phase: Phase) {
    this._phase = phase;
    if (phase === Phase.Clues) {
      this.turn.increment();
      this.players.assignRoles();
    }
    if (phase === Phase.TurnEnd) {
      // TODO if no more cards, end game
    }
  }

  /************************************************
    FSM TRANSITIONS
  ************************************************/
  
  private addPlayer(event: Event) {
    // console.log('adding player!')
    this.players.activate(event as AddPlayer)
  }

  private disconnectPlayer(event: Event) {
    this.players.get(event.playerId).deactivate();
  }

  private startGame(event: Event) {
    // console.log('start game?', this.players.activePlayerCount)
    if (this.players.activePlayerCount >= 4) {
      this.gameId++
      this.goToPhase(Phase.Clues)
      // console.log('yes!')
    }
  }

  private endGame(event: Event) {
    this.goToPhase(Phase.Pending)
  }

  private submitClue(event: Event) {
    this.players.get(event.playerId).setClue(event as SubmitClue);
    if (this.players.areCluePhaseReady) { this.goToPhase(Phase.Dupls) }
  }

  private rejectDups(event: Event) {
    this.players.asArray.forEach(player=>player.rejectDups(event as RejectDups))
    this.goToPhase(Phase.Guess)
  }

  private submitGuess(event: Event) {
    this.players.get(event.playerId).setGuess(event as SubmitGuess);
    this.goToPhase(Phase.Judge)
  }

  private skipGuess(event: Event) {
    this.players.guesser.skipGuess(event as SkipGuess);
    this.goToPhase(Phase.TurnEnd)
  }

  private acceptGuess(event: Event) {
    this.players.guesser.acceptGuess();
    this.goToPhase(Phase.TurnEnd)
  }

  private rejectGuess(event: Event) {
    this.players.guesser.rejectGuess();
    this.goToPhase(Phase.TurnEnd)
  }

}