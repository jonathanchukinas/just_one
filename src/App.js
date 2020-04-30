import React, { useState } from 'react';
import HelloServerButton from './HelloServerButton';
import ChatApp from './ChatApp/ChatApp';
import NavBar from './NavBar';
import ButtonsGame from './ButtonsGame/ButtonsGame';


export default function App() {
  
  const navLinks = [
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
