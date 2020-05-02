import React from 'react';
import Button from './Button';
import buttonMachineFactory from './Button.machine';


export default function ButtonsGame() {

  const machineInitialValues = [
    {
      playerID: 2,
      playerName: 'Mike',
      isSelf: false,
      // TODO isCOmplete was a temporary thing...
      
      isComplete: true,
    },
    {
      playerID: 1,
      playerName: 'Jonathan',
      isSelf: true,
      isComplete: true,
    },
    {
      playerID: 3,
      playerName: 'Nicholas',
      isSelf: false,
      isComplete: false,
    },
    {
      playerID: 4,
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


  const gameContext = {
    roundNum: 1,
  }

  
  return (
    <div className="m-6" >
      <h1>The Buttons Game</h1>
      <form>
        <label>
          Your Name:
          <input type="text" className="border-b mx-2" />
          <input type="submit" />
        </label>
      </form>
      <p>Round Number: {gameContext.roundNum}</p>      
      {machines.map(obj => <Button key={obj.playerID} machine={obj.machine}/> )}
    </div>
  );

}
