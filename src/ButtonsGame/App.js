import React, { useState, useEffect } from 'react';
import { game } from './game';
import { publish } from './pubsub';
// import { players } from './player'
import { Button } from './Button'


export default function ButtonsGame() {

  const [gameState, setGameState] = useState(game.state)

  useEffect(()=>{
    game.registerObserver(setGameState);
  },[])

  function nextRound() {
    const channel = { type: 'Game' }
    const eventEndRound = { type: 'END_ROUND' };
    publish(channel, eventEndRound);
  }

  function renderRound() {
    if (gameState.isDone) {
      return <p>Game over!</p>
    }
    return <>
      <p>Round Number: {gameState.round}</p>
      <button onClick={nextRound}>Next Round</button>
    </>
  }
  
  return (
    <div className="m-6" >
      <h1>The Buttons Game</h1>
      { renderRound() }
      {/* { players.map(player => <Button player={player} />)} */}
    </div>
  );

}
