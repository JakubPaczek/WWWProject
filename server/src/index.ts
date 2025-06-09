// importy bibliotek
import express from 'express'; // do tworzenia serwera HTTP
import cors from 'cors'; // obsługa CORS (łączenie frontend'u z backendem)
import jwt from 'jsonwebtoken'; // obsługa tokenów JWT
import { createServer } from 'http'; // łączenie express z socket.io
import { Server } from 'socket.io'; // socket.io – obsługa WebSocketów
import db from './db'; // baza danych
import authRoutes from './routes/auth'; // import tras: /auth/login, /auth/register
import { authenticateToken } from './middleware/auth'; // middleware JWT do REST API

const app = express();
const PORT = process.env.PORT || 5000; // Port backend'u (domyślnie 5000)
const httpServer = createServer(app); // łączenie Express z Node.js HTTP serverem

// lista dozwolonych źródeł
const allowedOrigins = [
    'http://localhost:5173',
    'https://jakubpaczek.github.io'
];

// konfiguracja socket.io
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins, // dozwolone źródła
        methods: ['GET', 'POST'],
        credentials: true, // przekazywanie ciastek
    },
});

// middleware Express
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

// REST API: wiadomości w danym pokoju (GET)
app.get('/messages/:room', authenticateToken, (req, res) => {
    const room = req.params.room;
    const messages = db.prepare('SELECT * FROM messages WHERE room = ? ORDER BY timestamp ASC').all(room);
    res.json(messages);
});

// REST API: dodanie nowej wiadomości (POST)
app.post('/messages/:room', authenticateToken, (req, res) => {
    const room = req.params.room;
    const { content } = req.body;
    const username = (req as any).user.username;
    const timestamp = Date.now();

    db.prepare('INSERT INTO messages (room, username, content, timestamp) VALUES (?, ?, ?, ?)')
        .run(room, username, content, timestamp);

    res.status(201).json({ message: 'Message saved' });
});

// REST API: lista pokojów
app.get('/rooms', authenticateToken, (_req, res) => {
    const rooms = db.prepare('SELECT * FROM rooms').all();
    res.json(rooms);
});

// Endpointy uwierzytelnienia: /auth/login i /auth/register
app.use('/auth', authRoutes);

// Middleware socket.io: Autoryzacja po tokenie JWT (przy połączeniu WebSocket)
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Brak tokena'));

    jwt.verify(token, 'tajny_klucz', (err: any, user: any) => {
        if (err) return next(new Error('Nieprawidłowy token'));
        (socket as any).user = user;
        next();
    });
});

// socket.io
io.on('connection', (socket) => {
    const username = (socket as any).user.username;
    console.log(`Socket połączony: ${username} (${socket.id})`);

    // dołączenie do pokoju czatu
    socket.on('join', (room) => {
        socket.join(room);
    });

    // odebranie wiadomości od klienta, zapisanie i broadcast do pokoju
    socket.on('message', ({ room, content }) => {
        const timestamp = Date.now();
        if (typeof content !== 'string' || content.trim().length === 0) return;

        db.prepare(
            'INSERT INTO messages (room, username, content, timestamp) VALUES (?, ?, ?, ?)'
        ).run(room, username, content, timestamp);

        // rozesłanie wiadomości do wszystkich w pokoju
        io.to(room).emit('message', { content, username, timestamp });
    });
});


// start serwera (HTTP + WebSocket)
httpServer.listen(PORT, () => {
    console.log(`Server with socket.io listening at http://localhost:${PORT}`);
});