const Database = require('better-sqlite3');

const db = new Database('equipamentos.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS equipamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        tipo TEXT,
        marca TEXT,
        problema TEXT,
        status TEXT
    )
`);

module.exports = db;
