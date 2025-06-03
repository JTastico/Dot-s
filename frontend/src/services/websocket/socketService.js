import { io } from "socket.io-client";

export const socket = io('/', {
  autoConnect: false,
  transports: ["websocket"], // Forzar WebSocket
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log("Socket conectado");
  } else {
    console.log("Socket ya estaba conectado");
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket desconectado");
  }
};
