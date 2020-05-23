import React, { useState } from 'react';
import NavBar from './NavBar';
import ChatApp from './ChatApp/App';
import ButtonsGame from './ButtonsGame/App';
import HelloServerButton from './HelloServerDemo/App';
import JustOne from './JustOne/App';


export default function App() {
  
  const navLinks = [
    {
      text: "Just One",
      page: <JustOne/>,
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
