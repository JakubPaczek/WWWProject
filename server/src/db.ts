import Database from 'better-sqlite3';

const db = new Database('chat.db');

// Tabela użytkowników
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT
  )
`).run();

// Tabela wiadomości
db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room TEXT,
    username TEXT,
    content TEXT,
    timestamp INTEGER
  )
`).run();

// Tabela pokoi
db.prepare(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  )
`).run();

const defaultRooms = ['Główny', 'Matematyka', 'Informatyka', 'Studia', 'Random'];

for (const name of defaultRooms) {
  try {
    db.prepare('INSERT INTO rooms (name) VALUES (?)').run(name);
  } catch {}
}

export default db;