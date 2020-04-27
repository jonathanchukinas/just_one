import io from "socket.io-client";
// import { SOCKET_URL } from "config";

// TODO: replace this and similar constants in a config file.

const SOCKET_URL = "http://localhost:5000";
const socket = io(SOCKET_URL);

socket.on('connect', ()=>{
  socket.send('A user has connected!');
  // TODO temp
  console.log("connected!")
});
socket.send("g'day, mate!");

export default socket