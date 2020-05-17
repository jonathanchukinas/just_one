import React, { useState } from 'react';
import { game } from './game';


export default function ButtonsGame() {

  const [gameState, setGameState] = useState(game.getState())

  
  function nextRound() {
    const eventEndRound = { type: 'END_ROUND' };
    setGameState(game.handleEvent(eventEndRound));
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
    </div>
  );

}
