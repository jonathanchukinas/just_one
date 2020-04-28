import React from 'react';
import Button from './Button';


export default function ButtonsGame() {

  const gameContext = {
    roundNum: 1,
    buttonContext: [
      {
        playerID: 2,
        playerName: 'Mike',
        isSelf: false,
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
      {gameContext.buttonContext.map(buttonContext => <Button key={buttonContext.playerID} buttonContext={buttonContext}/> )}
    </div>
  );

}
