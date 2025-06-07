import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

const BASE_URL = 'https://wwwproject.onrender.com';

const socket = io(BASE_URL, {
  auth: {
    token,
  },
});

export default socket;
