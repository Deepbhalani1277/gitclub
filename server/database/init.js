const db = require('./connection');
const seedData = require('../seed-data');

function initializeDatabase() {
  console.log('Initializing database schema...');

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT NOT NULL,
      category      TEXT NOT NULL,
      description   TEXT NOT NULL,
      date          TEXT NOT NULL,
      start_time    TEXT NOT NULL,
      end_time      TEXT,
      venue         TEXT NOT NULL,
      image_url     TEXT,
      max_capacity  INTEGER,
      reg_deadline  TEXT,
      status        TEXT NOT NULL DEFAULT 'upcoming',
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id      INTEGER NOT NULL,
      student_name  TEXT NOT NULL,
      email         TEXT NOT NULL,
      department    TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (event_id) REFERENCES events(id),
      UNIQUE(event_id, email)
    );
  `);

  // Check if events table is empty, then seed
  const countStmt = db.prepare('SELECT COUNT(*) AS count FROM events');
  const result = countStmt.get();

  if (result.count === 0) {
    console.log('Seeding database with sample events...');
    const insertStmt = db.prepare(`
      INSERT INTO events (
        title, category, description, date, start_time, end_time, venue, max_capacity, reg_deadline, status
      ) VALUES (
        @title, @category, @description, @date, @start_time, @end_time, @venue, @max_capacity, @reg_deadline, @status
      )
    `);

    const insertMany = db.transaction((events) => {
      for (const event of events) {
        insertStmt.run(event);
      }
    });

    insertMany(seedData);
    console.log('Database seeded successfully.');
  } else {
    console.log('Database already contains data, skipping seed.');
  }
}

module.exports = initializeDatabase;
