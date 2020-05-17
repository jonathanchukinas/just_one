import React, { useState } from 'react';
import NavBar from './NavBar';
import ChatApp from './ChatApp/App';
import ButtonsGame from './ButtonsGame/App';
import HelloServerButton from './HelloServerDemo/App';
import WordSubmitGame from './WordSubmitGame/App';


export default function App() {
  
  const navLinks = [
    {
      text: "The Buttons Game",
      page: <ButtonsGame/>,
    },
    {
      text: "The Word-Submit Game",
      page: <WordSubmitGame/>,
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
