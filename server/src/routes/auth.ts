import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';

const router = Router();
const SECRET = 'tajny_klucz'; // tajny klucz do podpisywania tokenów JWT

// endpoint POST /auth/register – rejestracja użytkownika
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // walidacja – brak loginu lub hasła
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password required' });
        return;
    }

    // sprawdzenie, czy użytkownik już istnieje
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (existingUser) {
        res.status(409).json({ message: 'User already exists' });
        return;
    }

    // haszowanie hasła (salt 10)
    const passwordHash = await bcrypt.hash(password, 10);

    // zapisanie użytkownika do bazy danych
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash);

    res.status(201).json({ message: 'User registered' });
});

// endpoint POST /auth/login – logowanie
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // pobranie użytkownika z bazy
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as {
        username: string;
        password_hash: string;
    } | undefined;

    // sprawdzenie poprawności loginu
    if (!user || !user.password_hash) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    // porównanie hasła z hashem z bazy
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    // generowanie tokena JWT (ważność 1h)
    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });

    // zwrócenie tokena do klienta
    res.json({ token });
});

export default router;