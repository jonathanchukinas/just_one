import React, { useState, useEffect } from 'react';
import Button from './Button';
import buttonsGameMachine from './ButtonsGame.machine';
import { useMachine } from '@xstate/react';


export default function ButtonsGame() {


  // Buttons Game Machine
  const [state, send, service] = useMachine(buttonsGameMachine);
  useEffect(() => {
    // Prepopulate players
    const initialPlayerNames = [
      "Jonathan",
      "Mike",
      "Austin",
    ]
    initialPlayerNames.forEach(playerName => {
      send('ADD_PLAYER', { playerName })
    })
    // onTransition
    service.onTransition((currentState)=>{console.log('game state', state.context.roundCount, currentState.value)})
    send('START_GAME')
  }, [send])


  
  // Add Players
  const [playerName, setPlayerName] = useState("");
  const handleNewPlayerName = event => { setPlayerName(event.target.value); }
  const newPlayerTextBox = React.createRef();
  function handleAddPlayer(event) {
    event.preventDefault();
    if (playerName) {
      send('ADD_PLAYER', { playerName })
      setPlayerName("");
      event.target.reset();
      newPlayerTextBox.current.focus();
    }
  }


  const players = state.context.players
  const playerNames = Object.keys(players)


  return (
    <div className="m-6" >
      <h1>The Buttons Game</h1>
      <form onSubmit={ handleAddPlayer } >
        <label>
          Add Player:
          <input type="text" ref={newPlayerTextBox} onChange={handleNewPlayerName} className="border-b mx-2" placeholder="player name" />
          <input type="submit" value="Create New Player" />
        </label>
      </form>
      <p>Round Number: {state.context.roundCount}</p>      
      {playerNames.map(playerName => {
        const playerMachine = players[playerName];
        return <Button key={playerName} machine={playerMachine} /> 
      })}
    </div>
  );

}
