import React, { useState, useEffect } from 'react';
import Button from './Button';
import buttonsGameMachine from './ButtonsGame.machine';
import { useMachine } from '@xstate/react';


export default function ButtonsGame() {


  // Buttons Game Machine
  const [state, send] = useMachine(buttonsGameMachine);
  useEffect(() => {
    const initialPlayerNames = [
      "Jonathan",
      "Mike",
      "Austin",
    ]
    initialPlayerNames.forEach(playerName => {
      send('ADD_PLAYER', { playerName })
    })
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



  console.log('state', state)
  console.log('context', state.context)
  console.log('players1', state.context.players)


  const players = state.context.players
  console.log('players2', players)
  const playerNames = Object.keys(players)
  console.log('playerNames', playerNames)


  
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
