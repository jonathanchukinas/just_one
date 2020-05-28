
export type PlayerID = number;

/************************************************
  EVENTS
************************************************/

export type E_AddPlayer = {
  type: 'ADD_PLAYER',
  id: PlayerID,
  name?: string
}

export type E_EndRound = {
  type: 'END_ROUND',
}

export type E_Toggle = {
  type: 'TOGGLE'
}

export type E_Reset = {
  type: 'RESET'
}


export type Event =
  | E_AddPlayer
  | E_EndRound
  | E_Toggle
  | E_Reset

/************************************************
  PUBSUB
************************************************/

export type Channel =
  // | { type: 'Global' }
  | { type: 'Game' | 'AllPlayers' }
  | { type: 'Player', id: PlayerID }

/************************************************
  PLAYER
************************************************/

export type P_Context = {
  name: string,
  id: PlayerID,
};

export type P_Schema = {
  states: {
    incomplete: {},
    complete: {},
  }
};

export interface P_PublicState extends P_Context {
  isReady: boolean,
};

/************************************************
  GAME
************************************************/

export type G_Player = {
  id: PlayerID,
  isReady: boolean,
  clue?: string,
}

export type G_Players = Map<PlayerID, G_Player>

export type G_Context = {
  round: number,
};

export type G_Schema = {
  states: {
    round: {},
    endGame: {},
  }
};

export type G_PublicState = {
  round: number,
  isDone: boolean,
  playerState: P_PublicState[],
}
