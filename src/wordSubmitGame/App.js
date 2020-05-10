import React, { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { gameMachine } from './gameMachine';
// import type {
//   GameContext,
//   GameSchema,
//   GameEvent,
//   Player,
// } from './gameTypes'
// import type {
//   TurnNum,
// } from './simpleTypes'
import {
  isSelf,
  renderName,
} from './gameTypes'
// import type * as E from './events'



export default function WordSubmitGame() {

  const [state, send] = useMachine(gameMachine)

  // TODO add TS back in
  // const events: Array<E.AddPlayer|E.NamePlayer> = [
  const events = [
    { type: 'ADD_PLAYER', playerID: 1 },
    { type: 'ADD_PLAYER' },
    { type: 'ADD_PLAYER' },
    { type: 'NAME_PLAYER', playerID: 1, playerName: 'Jonathan' },
    { type: 'NAME_PLAYER', playerID: 3, playerName: 'Nicholas' },
  ]
  useEffect(()=>{
    send(events)
  }, [])

  // TODO TS for JSX element?
  // TODO add TS back in
  // function getListItem(player: Player) {
  function getListItem(player) {
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
