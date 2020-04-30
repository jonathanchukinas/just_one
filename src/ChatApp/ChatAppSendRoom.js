import React, { useState } from 'react';
import socket from '../eventManager/socket.js';
import ChatAppRequestRoom from './ChatAppRequestRoom';

export default function ChatAppSendRoom(props) {

  const textInputElement = React.createRef();
  const [message, setMessage] = useState("");

  function handleChangeMessage(event) {
    setMessage(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (message) {
      const payload = {
        room: props.room,
        name: props.name,
        msg: message,
      }
      socket.emit("room_message", payload);
      setMessage("");
      event.target.reset();
      textInputElement.current.focus();
    }
  }

  return (<>
    <h2 className="text-red-500 text-lg font-bold mb-3">rooms</h2>
    <p className="text-gray-500" >Note: I never got this room functionality fully ported over to the react app.</p>
    <p className="text-gray-500" >You can join a room, but the room messaging just isn't wired up.</p>
    <ChatAppRequestRoom setRoom={props.setRoom }/>
    <form onSubmit={handleSubmit} >
      <input type="text" ref={textInputElement} onChange={handleChangeMessage} className="mb-6 border border-gray-500"/>
      <input type="submit" value="Send"/>
    </form>
  </>);

}
