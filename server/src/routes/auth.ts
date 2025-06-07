import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';

const router = Router();
const SECRET = 'tajny_klucz';


router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password required' });
        return;
    }

    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (existingUser) {
        res.status(409).json({ message: 'User already exists' });
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, passwordHash);

    res.status(201).json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as { username: string; password_hash: string } | undefined;

    if (!user || !user.password_hash) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
});

export default router;
