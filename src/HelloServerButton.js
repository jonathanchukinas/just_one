import React from 'react';
import socket from './eventManager/socket.js';

export default function HelloServerButton() {

  const sayHi = ()=>{
    socket.send("Hello, server!!!")
  };

  return (<>
    <div className="m-6">
      <h1 className="font-bold">SocketIO Message Demo</h1>
      <p>Click it to send a simple message to the server.</p>
      <p className="mb-6">You'll see a message on the api server terminal.</p>
      <button className="bg-blue-300 hover:bg-blue-500 text-blue-900 font-bold py-2 px-4 rounded-full" onClick={sayHi}>Say hello to the server!</button>
    </div>
  </>);

}
