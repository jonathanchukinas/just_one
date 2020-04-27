import React, { useState } from 'react';
import socket from './socket.js';

export default function ChatAppSendNamed(props) {

  const textInputElement = React.createRef();
  const [message, setMessage] = useState("");

  function handleChangeName(event) {
    props.setName(event.target.value);
  }

  function handleChangeMessage(event) {
    setMessage(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (message) {
      const payload = {
        name: props.name,
        msg: message,
      }
      socket.emit("message_with_name", payload);
      setMessage("");
      event.target.reset();
      textInputElement.current.focus();
    }
  }

  return (<>
    <h2 className="text-red-500 text-lg font-bold mb-3">custom event</h2>
    <form onSubmit={handleSubmit} >
      <label>
        Your Name:
        <input type="text" onChange={handleChangeName} value={props.name} className="mb-3 border border-gray-500"/>
      </label>
      <input type="text" ref={textInputElement} onChange={handleChangeMessage} className="mb-6 border border-gray-500"/>
      <input type="submit" value="Send"/>
    </form>
  </>);

}
