import { 
  PlayerId,
  TurnGetter,
  AddPlayer,
  Role,
  PlayerState
} from './types';
import { Player } from './player'

type playerMap = Map<PlayerId, Player>

export class PlayerCollection {

  private players: playerMap
  private playOrder: PlayerOrder

  constructor(private turnGetter: TurnGetter) {
    this.players = new Map();
    this.playOrder = new PlayerOrder(this);
  }

  get asArray(): Player[] {
    return (Array.from(this.players.values()))
  }

  get length(): number {
    return this.players.size
  }

  get areCluePhaseReady(): boolean {
    const reducer = (isReady: boolean, player: Player) => isReady && player.isCluePhaseReady;
    return this.asArray.reduce(reducer, true)
  }

  get(playerId: PlayerId): Player {
    const player = this.players.get(playerId);
    if (typeof player === 'undefined') {
      throw new Error('Player does not exist') 
    } else {
      return player
    }
  }

  get activePlayerCount(): number {
    // console.log('calcing active player count')
    const reducer = (activePlayerCount: number, player: Player) => {
      // console.log('reducer')
      return activePlayerCount + (player.isActive ? 1 : 0);
    };
    // console.log(this.asArray)
    const count = this.asArray.reduce(reducer, 0)
    return count
  }

  activate(event: AddPlayer, role: Role = Role.Unassigned): void {
    const { playerId, playerName } = event;
    const newPlayer = new Player(playerId, playerName, this.turnGetter);
    newPlayer.role = role
    this.players.set(playerId, newPlayer);
  }

  assignRoles() {
    const guesser = this.playOrder.nextGuesser();
    const clueLeader = this.playOrder.nextClueLeader();
    this.asArray.forEach(player => {
      if (player.id === guesser.id) {
        player.role = Role.Guesser;
      } else if (player.id === clueLeader.id) {
        player.role = Role.ClueLeader
      } else {
        player.role = Role.ClueGiver;
      }
    });
  }

  get guesser(): Player {
    for (const player of this.asArray) {
      if (player.role === Role.Guesser) {
        return player
      }
    }
    throw new Error('No guesser!')
  }

  getState(): PlayerState[] {
    return this.asArray.map(player => player.getState())
  }

}


class PlayerOrder {

  private _playerOrder: Player[]
  private playerCount: number
  private _nextPlayer?: Player
  constructor(private players: PlayerCollection) {
    this._playerOrder = []
    this.playerCount = 0;
  }

  nextGuesser(): Player {
    return this.nextPlayer(true)
  }

  nextClueLeader(): Player {
    return this.nextPlayer(false)
  }

  private nextPlayer(removeFromList: boolean = true) {
    this.incorporateAnyNewPlayers();
    let player = this.getNextPlayerFromList(removeFromList);
    if (player) { return player; }
    this.resetOrder();
    player = this.getNextPlayerFromList(removeFromList);
    if (player) {
      return player;
    } else {
      throw new Error('no players available')
    }
  }

  private incorporateAnyNewPlayers():void {    
    while (this.players.length > this.playerCount) {
      const index = this.playerCount
      const newPlayer = this.players.asArray[index]
      this._playerOrder.push(newPlayer)
      this.playerCount++
    }
  }

  private getNextPlayerFromList(removeFromList: boolean): Player | undefined {
    for (const [i, player] of this._playerOrder.entries()) {
      if (player.isActive) {
        if (removeFromList) {
          this._playerOrder.splice(i, 1)
        }
        return player;
      }
    }
    return undefined
  }

  private resetOrder(): void {
    this._playerOrder = this.players.asArray
  }

}