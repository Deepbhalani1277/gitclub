const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../events.db');

// Create a new database connection (or open existing)
// Set verbose to console.log to see queries during development
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

module.exports = db;
