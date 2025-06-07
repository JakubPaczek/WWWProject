import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import db from './db';
import { authenticateToken } from './middleware/auth';
import jwt from 'jsonwebtoken';

// diff
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = 5000;
const httpServer = createServer(app);

// Konfiguracja socket.io
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173', // dokładny frontend
        credentials: true,
    },
});


app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.get('/messages/:room', authenticateToken, (req, res) => {
    const room = req.params.room;
    const messages = db.prepare('SELECT * FROM messages WHERE room = ? ORDER BY timestamp ASC').all(room);
    res.json(messages);
});

app.post('/messages/:room', authenticateToken, (req, res) => {
    const room = req.params.room;
    const { content } = req.body;
    const username = (req as any).user.username;
    const timestamp = Date.now();

    db.prepare('INSERT INTO messages (room, username, content, timestamp) VALUES (?, ?, ?, ?)')
        .run(room, username, content, timestamp);

    res.status(201).json({ message: 'Message saved' });
});

app.get('/rooms', authenticateToken, (_req, res) => {
    const rooms = db.prepare('SELECT * FROM rooms').all();
    res.json(rooms);
});

// app.post('/rooms', authenticateToken, (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ message: 'Room name required' });

//   try {
//     db.prepare('INSERT INTO rooms (name) VALUES (?)').run(name);
//     res.status(201).json({ message: 'Room created' });
//   } catch (err) {
//     res.status(409).json({ message: 'Room already exists' });
//   }
// });

app.use('/auth', authRoutes);

// Obsługa socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Brak tokena'));

  jwt.verify(token, 'tajny_klucz', (err, user) => {
    if (err) return next(new Error('Nieprawidłowy token'));
    (socket as any).user = user;
    next();
  });
});

io.on('connection', (socket) => {
  const username = (socket as any).user.username;
  console.log(`Socket połączony: ${username} (${socket.id})`);

  socket.on('join', (room) => {
    socket.join(room);
  });

  socket.on('message', ({ room, content }) => {
    const timestamp = Date.now();
    if (typeof content !== 'string' || content.trim().length === 0) return;

    db.prepare(
      'INSERT INTO messages (room, username, content, timestamp) VALUES (?, ?, ?, ?)'
    ).run(room, username, content, timestamp);

    io.to(room).emit('message', { content, username, timestamp });
  });
});


// Uruchomienie serwera HTTP z socket.io
httpServer.listen(PORT, () => {
    console.log(`Server with socket.io listening at http://localhost:${PORT}`);
});
