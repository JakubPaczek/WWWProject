import { io, Socket } from 'socket.io-client';

let socket: Socket;

export function connectSocket(token: string) {
  socket = io('https://wwwproject.onrender.com', {
    transports: ['websocket'],
    withCredentials: true,
    auth: { token },
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}
