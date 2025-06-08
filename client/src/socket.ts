import { io } from 'socket.io-client';

const BASE_URL = 'https://wwwproject.onrender.com';

const token = localStorage.getItem('token');

const socket = io(BASE_URL, {
    transports: ['websocket'], // wymusza WebSocket
    withCredentials: true,
    auth: {
        token: token
    },
});

export default socket;
