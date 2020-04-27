import React from 'react';
import ChatAppMessageList from './ChatAppMessageList';
import socket from './socket.js';


export default function ChatAppReceiveRoom(props) {

  socket.on('room_message', payload => {
    const room = payload.room
    const newMessage = {
      name: payload.name,
      msg: payload.msg,
    }
    if (room in props.roomMessages) {
      props.setRoomMessages({
        ...props.roomMessages,
        [room]: [
          ...props.roomMessages[room],
          newMessage,
        ]
      })
    } else {
      props.setRoomMessages({
        ...props.roomMessages,
        [room]: [
          newMessage,
        ]
      })
    }
    
  });

  function renderRoomName() {
    if (props.room) {
      return ` (${props.room})`
    }
    return "";
  }

  function leaveRoom() {
    socket.emit('leave_room', {
      room: props.room,
      name: props.name,
    });
  };

  socket.on('leave_room', () => {
    props.setRoom("")
  });

  const room = props.room;
  const thisRoomMessages = props.roomMessages[room];
  console.log(thisRoomMessages)

  return (<>
    <h2 className="text-red-500 text-lg font-bold mb-3">Room Chat{renderRoomName()}</h2>
    <input id="leave_room" type="submit" value="Leave" onClick={leaveRoom} className="cursor-pointer"/>
    {/* (thisRoomMessages && <ChatAppMessageList room={room} messages={thisRoomMessages} /> ) */}
  </>);

}
