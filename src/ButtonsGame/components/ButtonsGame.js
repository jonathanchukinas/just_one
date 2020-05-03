import React, { useState } from 'react';
import Button from './Button';
import buttonsGameMachine from './ButtonsGame.machine';
import buttonMachineFactory from './Button.machine';
import { useMachine } from '@xstate/react';


export default function ButtonsGame() {


  // Button Machines
  const machineInitialValues = [
    {
      playerID: 12,
      playerName: 'Mike',
      isSelf: false,
      // TODO isCOmplete was a temporary thing...
      
      isComplete: true,
    },
    {
      playerID: 10,
      playerName: 'Jonathan',
      isSelf: true,
      isComplete: true,
    },
    {
      playerID: 13,
      playerName: 'Nicholas',
      isSelf: false,
      isComplete: false,
    },
    {
      playerID: 14,
      playerName: 'ImpossibleAlterEgo',
      isSelf: true,
      isComplete: false,
    },
  ]
  function mapToMachine(obj) {
    return {
      playerID: obj.playerID,
      machine: buttonMachineFactory(obj.playerName, obj.isSelf, obj.playerID),
    }
  };
  const machines = machineInitialValues.map(mapToMachine)


  // Buttons Game Machine
  const [state, send] = useMachine(buttonsGameMachine);
  const [playerName, setPlayerName] = useState("");
  const handleNewPlayerName = event => { setPlayerName(event.target.value); }
  const newPlayerTextBox = React.createRef();
  function handleAddPlayer(event) {
    event.preventDefault();
    if (playerName) {
      send('ADD_PLAYER', { playerName: playerName })
      setPlayerName("");
      event.target.reset();
      newPlayerTextBox.current.focus();
    }
  }


  console.log(state)

  
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
      <p>Round Number: 1</p>      
      {machines.map(obj => <Button key={obj.playerID} machine={obj.machine}/> )}
    </div>
  );

}
