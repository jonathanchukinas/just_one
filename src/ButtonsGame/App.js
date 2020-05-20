import React, { useState, useEffect } from 'react';
import { game } from './game';
import { publish } from './pubsub';
import { Button } from './Button'


export default function ButtonsGame() {

  const [gameState, setGameState] = useState(game.state)
  const { round, isDone, playerState } = gameState;

  useEffect(()=>{
    game.registerObserver(setGameState);
  },[])

  function nextRound() {
    const channel = { type: 'Game' }
    const eventEndRound = { type: 'END_ROUND' };
    publish(channel, eventEndRound);
  }

  function renderRound() {
    if (isDone) {
      return <p>Game over!</p>
    }
    return <>
      <p>Round Number: {round}</p>
      <button onClick={nextRound}>Next Round</button>
    </>
  }

  
  
  return (
    <div className="m-6" >
      <h1>The Buttons Game</h1>
      { renderRound() }
      { playerState.map(player => <Button key={ player.id } playerState={ player } />)}
    </div>
  );

}
