import React, { useState } from 'react';
import HelloServerButton from './HelloServerButton';
import ChatApp from './ChatApp';
import NavBar from './NavBar';


export default function App() {

  const buttonPage = <HelloServerButton/>;
  const chatPage = <ChatApp/>;
  // const [currentPage, setCurrentPage] = useState(buttonPage);
  const [currentPage, setCurrentPage] = useState(chatPage);

  const navLinks = [
    {
      text: "Hello Server",
      page: buttonPage
    },
    {
      text: "Chat App",
      page: chatPage
    },
  ];

  return (<>
    <NavBar buttons={navLinks} setCurrentPage={setCurrentPage}/>
    {currentPage}
  </>);

}
