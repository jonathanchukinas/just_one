import { 
  PlayerId,
  TurnGetter,
  AddPlayer,
  PlayerRole,
} from './types';
import { Player } from './player'


export class PlayerCollection {

  private players: Map<PlayerId, Player>

  constructor(private turnGetter: TurnGetter) {
    this.players = new Map();
  }

  get asArray(): Player[] {
    return Array.from(this.players.values())
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
    const reducer = (activePlayerCount: number, player: Player) => {
      return activePlayerCount + (player.isActive ? 1 : 0);
    };
    return this.asArray.reduce(reducer, 0)
  }

  activate(event: AddPlayer, role: PlayerRole = PlayerRole.Unassigned): void {
    const { playerId, playerName } = event;
    const newPlayer = new Player(playerId, playerName, this.turnGetter);
    newPlayer.role = role
    this.players.set(playerId, newPlayer);
  }

  assignRoles() {
    // TODO this needs to be a little more sophisticated
    this.players.forEach(player => {
      if (player.id === 1) {
        player.role = PlayerRole.Guesser;
      } else {
        player.role = PlayerRole.ClueGiver;
      }
    })
  }

  get guesser(): Player {
    for (const player of this.asArray) {
      if (player.role === PlayerRole.Guesser) {
        return player
      }
    }
    throw new Error('No guesser!')
  }

}