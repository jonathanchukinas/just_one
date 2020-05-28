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
  
  return (<div className='h-screen flex flex-col'>
    <NavBar className='flex-none' buttons={navLinks} setCurrentPage={setCurrentPage}/>
    <div className='flex-grow bg-green-500'>
      {currentPage}
    </div>
  </div>);

}
