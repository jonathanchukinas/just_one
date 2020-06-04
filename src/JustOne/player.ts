import {
  PlayerId,
  Role,
  TurnNum, TurnGetter,
  Event, TurnEvent,
  Clue, Clues,
  Guess, Guesses,
  SubmitClue,
  RejectDups,
  Status,
  SubmitGuess,
  SkipGuess,
  AcceptGuess,
  RejectGuess,
  Connection,
  PlayerState,
} from './types'


const NullClue = Symbol();


type Roles = Map<TurnNum, Role>


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
    let isReady = true
    if (this.isActive) {
      if (this.role === Role.ClueGiver) {
        if (!this.hasClue()) {
          isReady = false
        }
      }
    }
    // console.log(this.id, this.role, isReady)
    return isReady;
  }

  get isActive(): boolean {
    // console.log('is active?')
    return this.connection === Connection.Active
  }

  setClue(event: SubmitClue) {
    const { clue: value, turnNum } = this.isCurrentTurn(event);
    const clue: Clue = {
      value,
      turnNum,
      status: Status.Pending,
    }
    this.clues.set(turnNum, clue)
  }

  rejectDups(event: RejectDups): void {
    const { duplicates: duplicates, turnNum } = this.isCurrentTurn(event);
    const clue = this.clues.get(turnNum);
    if (typeof clue === 'undefined') { return }
    if (duplicates.includes(this.clue.value)) {
      clue.status = Status.Rejected
    } else {
      clue.status = Status.Accepted
    }
  }

  setGuess(event: SubmitGuess) {
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

  skipGuess(event: SkipGuess) {
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

  set role(value: Role) {
    this.roles.set(this.turnGetter(), value);
  }

  get role(): Role {
    const turnNum = this.turnGetter();
    const role = this.roles.get(turnNum);
    if (typeof role === 'undefined') {
      return Role.Unassigned;
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

  deactivate() {
    this.connection = Connection.Broken
  }

  getState(): PlayerState {
    const state: PlayerState = {
      id: this.id,
      name: this.name,
      role: this.role
    }
    return state;
  }
}