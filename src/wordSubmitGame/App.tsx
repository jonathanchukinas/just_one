import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { gameMachine } from './gameMachine';
import type {
  Player,
} from './gameTypes'
// import type {
//   TurnNum,
// } from './simpleTypes'
import {
  isSelf,
  renderName,
} from './gameTypes'
import type * as E from './events'



export default function WordSubmitGame() {

  const [state, send] = useMachine(gameMachine)

  useEffect(()=>{
    const events: Array<E.AddPlayer|E.NamePlayer|E.SetSelf> = [
      { type: 'ADD_PLAYER', playerID: 1 },
      { type: 'ADD_PLAYER' },
      { type: 'ADD_PLAYER' },
      { type: 'NAME_PLAYER', playerID: 1, playerName: 'Jonathan' },
      { type: 'NAME_PLAYER', playerID: 3, playerName: 'Nicholas' },
      { type: 'SET_SELF', playerID: 1 },
    ]
    send(events)
  }, [send])

  function getListItem(player: Player) {
    // Render Name
    let name = renderName(player)
    if (isSelf(state.context, player)) { name += ' (self)' }

    // Render Clue
    const turnNum = 1;
    let clue = player.clues.get(turnNum)
    if (typeof clue === 'undefined') { clue = '[still thinking...]' }

    const text = `${name}: ${clue}`
    return <li key={ player.id } >{ text }</li>
  }

  return <ul>
    { Array.from(state.context.players.values()).map(player => getListItem(player)) }
  </ul>;

}
