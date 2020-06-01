import {
  PlayerId,
  PlayerRole,
  TurnNum, TurnGetter,
  Event, TurnEvent,
  Clue, Clues,
  Guess, Guesses,
  SubmittedClue,
  RejectedDuplicates,
  Status,
  SubmittedGuess,
  SkippedGuess,
  AcceptedGuess,
  RejectedGuess,
  Connection,
} from './types'


const NullClue = Symbol();


type Roles = Map<TurnNum, PlayerRole>


export class Player {

  public clues: Clues
  public guesses: Guesses
  private roles: Roles
  private connection: Connection

  constructor(
    readonly id: PlayerId,
    readonly name: string,
    private turnGetter: TurnGetter,
  ) {
    this.clues = new Map;
    this.guesses = new Map;
    this.roles = new Map;
    this.connection = Connection.Active
  }

  get isCluePhaseReady(): boolean {
    if (this.isActive) {
      if (this.role === PlayerRole.ClueGiver) {
        if (!this.hasClue()) {
          return false
        }
      }
    }
    return true;
  }

  get isActive(): boolean {
     return this.connection === Connection.Active
  }

  setClue(event: SubmittedClue) {
    const { clue: value, turnNum } = this.isCurrentTurn(event);
    const clue: Clue = {
      value,
      turnNum,
      status: Status.Pending,
    }
    this.clues.set(turnNum, clue)
  }

  rejectDuplicate(event: RejectedDuplicates): void {
    const { clues: duplicates, turnNum } = this.isCurrentTurn(event);
    const clue = this.clues.get(turnNum);
    if (typeof clue === 'undefined') { return }
    if (duplicates.includes(this.clue.value)) {
      clue.status = Status.Rejected
    } else {
      clue.status = Status.Accepted
    }
  }

  setGuess(event: SubmittedGuess) {
    const { guess: value, turnNum } = this.isCurrentTurn(event);
    const newGuess = {
      value,
      turnNum,
      status: Status.Pending
    }
    this.guesses.set(turnNum, newGuess)
  }  

  acceptGuess() {
    const guess = this.guesses.get(this.turnGetter());
    if (typeof guess !== 'undefined' && 'value' in guess) {
      guess.status = Status.Accepted
    } else {
      throw new Error('No guess to be accepted!')
    }
  }    

  rejectGuess() {
    const guess = this.guesses.get(this.turnGetter());
    if (typeof guess !== 'undefined' && 'value' in guess) {
      guess.status = Status.Rejected;
    } else {
      throw new Error('No guess to be rejected!')
    }
  }    

  skipGuess(event: SkippedGuess) {
    const { turnNum } = this.isCurrentTurn(event);
    const newSkip: Guess = {
      turnNum,
      status: 'skipped'
    }
    this.guesses.set(turnNum, newSkip)
  }

  private hasClue(): boolean {
    const turnNum = this.turnGetter();
    return this.clues.has(turnNum)
  }

  set role(value: PlayerRole) {
    this.roles.set(this.turnGetter(), value);
  }

  get role(): PlayerRole {
    const turnNum = this.turnGetter();
    const role = this.roles.get(turnNum);
    if (typeof role === 'undefined') {
      return PlayerRole.Unassigned;
    } else {
      return role;
    }
  }

  get clue(): Clue {
    const clue = this.clues.get(this.turnGetter());
    if (typeof clue === 'undefined') { throw new Error('No clue available') }
    return clue;
  }

  private isCurrentTurn<T extends TurnEvent>(event: T): T {
    if (event.turnNum === this.turnGetter()) { return event }
    throw new Error('Turn mismatch!');
  }

}