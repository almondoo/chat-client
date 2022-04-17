import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_CHAT_SERVER, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
