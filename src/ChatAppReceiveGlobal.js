import React from 'react';
import ChatAppMessageList from './ChatAppMessageList';
import socket from './socket.js';


export default function ChatAppGlobal(props) {

  socket.on('message', (msg) => {
    props.setGlobalMessages([
      ...props.globalMessages,
      {msg: msg},
    ])
  });

  socket.on('message_with_name', (payload) => {
    props.setGlobalMessages([
      ...props.globalMessages,
      {
        name: payload.name,
        msg: payload.msg,
      }
    ])
  });

  return (<>
    <h2 className="text-red-500 text-lg font-bold mb-1">Global Chat</h2>
    <ChatAppMessageList messages={props.globalMessages} /> 
  </>);

}
