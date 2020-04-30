import React, { useState } from 'react';
import socket from '../socket.js';

export default function ChatAppSendSimple() {

  const textInputElement = React.createRef();
  const [message, setMessage] = useState("")

  function handleChange(event) {
    setMessage(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (message) {
      socket.send(message);
      setMessage("");
      event.target.reset();
      textInputElement.current.focus();
    }
  }

  return (<>
    <h2 className="text-red-500 text-lg font-bold mb-3">message event</h2>
    <form onSubmit={handleSubmit} >
      <input type="text" ref={textInputElement} onChange={handleChange} className="mb-6 border border-gray-500"/>
      <input type="submit" value="Send"/>
    </form>
  </>);

}
