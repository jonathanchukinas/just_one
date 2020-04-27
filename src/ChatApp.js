import React, { useState } from 'react';
import ChatAppReceiveGlobal from './ChatAppReceiveGlobal';
import ChatAppSendSimple from './ChatAppSendSimple';
import ChatAppSendNamed from './ChatAppSendNamed';
import ChatAppSendRoom from './ChatAppSendRoom';
import ChatAppReceiveRoom from './ChatAppReceiveRoom';

export default function ChatApp() {
  
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [globalMessages, setGlobalMessages] = useState([
    {
      name: "Jonathan",
      msg: "Hello!",
    },
    {
      msg: "It's Saturday",
    },
    {
      name: "Nicholas",
      msg: "Who's this?",
    },
    {
      msg: "I'm not saying...",
    },
  ]);
  const [roomMessages, setRoomMessages] = useState({});
  
  return (
    <div className="font-mono p-1">
      <h1 className="text-red-700 text-2xl font-extrabold p-6 bg-blue-200 mb-1">SocketIO Demo</h1>
      <div className="flex">
        <div className="flex-1 bg-blue-100 p-6">
          <ChatAppSendSimple/>
          <ChatAppSendNamed name={name} setName={setName} />
          <ChatAppSendRoom name={name} room={room} setRoom={setRoom} />
        </div>
        <div className="flex-1 bg-blue-200 p-6 m-1 mt-0">
          <ChatAppReceiveGlobal globalMessages={globalMessages} setGlobalMessages={setGlobalMessages} />
        </div>
        <div className="flex-1 bg-blue-100 p-6">
          <ChatAppReceiveRoom name={name} room={room} setRoom={setRoom} roomMessages={roomMessages} setRoomMessages={setRoomMessages} />
        </div>
      </div>
      <div className="bg-blue-100 h-6"></div>
    </div>
  );

}
