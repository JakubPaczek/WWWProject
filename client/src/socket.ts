import { io } from 'socket.io-client';

const BASE_URL = 'https://wwwproject.onrender.com';

const socket = io(BASE_URL, {
    transports: ['websocket'], // wymusza WebSocket
    withCredentials: true
});

export default socket;
