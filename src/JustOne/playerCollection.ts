import { 
  PlayerId,
  TurnGetter,
  AddedPlayer,
  PlayerRole,
} from './types';
import { Player } from './player'


export class PlayerCollection {

  private players: Map<PlayerId, Player>

  constructor(private turnGetter: TurnGetter) {
    this.players = new Map();
  }

  private get asArray(): Player[] {
    return Array.from(this.players.values())
  }

  public get areCluePhaseReady(): boolean {
    const reducer = (isReady: boolean, player: Player) => isReady && player.isCluePhaseReady;
    return this.asArray.reduce(reducer, true)
  }

  public get(playerId: PlayerId): Player {
    const player = this.players.get(playerId);
    if (typeof player === 'undefined') {
      throw new Error('Player does not exist') 
    } else {
      return player
    }
  }

  public getActivePlayerCount() {
    const reducer = (activePlayerCount: number, player: Player) => {
      return activePlayerCount + (player.isCluePhaseReady ? 1 : 0);
    };
    return this.asArray.reduce(reducer, 0)
  }

  public add(event: AddedPlayer, role: PlayerRole = PlayerRole.Unassigned) {
    const { playerId, playerName } = event;
    const newPlayer = new Player(playerId, playerName, this.turnGetter);
    newPlayer.role = role
    this.players.set(playerId, newPlayer);
  }

}