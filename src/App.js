import React, { useState } from 'react';
import NavBar from './NavBar';
import ChatApp from './ChatApp/App';
import ButtonsGame from './ButtonsGame/App';
import HelloServerButton from './HelloServerDemo/App';


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
    navLinks[2].page
  );
  
  return (<>
    <NavBar buttons={navLinks} setCurrentPage={setCurrentPage}/>
    {currentPage}
  </>);

}
