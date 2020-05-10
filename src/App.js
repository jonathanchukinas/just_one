import React, { useState } from 'react';
import NavBar from './NavBar';
import ChatApp from './ChatApp/App';
import ButtonsGame from './ButtonsGame/App';
import HelloServerButton from './HelloServerDemo/App';
import WordSubmitGame from './WordSubmitGame/App';
import TimedToggle from './TimedToggle/App'

export default function App() {
  
  const navLinks = [
    {
      text: "Timed Toggle",
      page: <TimedToggle/>,
    },
    {
      text: "The Word-Submit Game",
      page: <WordSubmitGame/>,
    },
    {
      text: "The Buttons Game",
      page: <ButtonsGame/>,
    },
    {
      text: "Chat App",
      page: <ChatApp/>,
    },
    {
      text: "Hello Server",
      page: <HelloServerButton/>,
    },
  ];

  const [currentPage, setCurrentPage] = useState(
    navLinks[0].page
  );
  
  return (<>
    <NavBar buttons={navLinks} setCurrentPage={setCurrentPage}/>
    {currentPage}
  </>);

}
