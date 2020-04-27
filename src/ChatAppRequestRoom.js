import React, { useState } from 'react';
import socket from './socket.js';

// TODO check all function names
export default function ChatAppRequestRoom(props) {

  const roomInput = React.createRef();
  const [requestedRoom, setRequestedRoom] = useState("")

  function handleChange(event) {
    setRequestedRoom(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (requestedRoom) {      
      socket.emit("room_request", {room: requestedRoom});
      setRequestedRoom("");
      event.target.reset();
      roomInput.current.focus();
    }
  }

  socket.on('room_confirmed', payload=>{
    props.setRoom(payload.room);
  });

  return (<>
    <form onSubmit={handleSubmit} >
      <input type="text" ref={roomInput} onChange={handleChange} className="mb-6 border border-gray-500"/>
      <input type="submit" value="Request"/>
    </form>
  </>);

}
