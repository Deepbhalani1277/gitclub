require('dotenv').config();
const app = require('./app');
const initializeDatabase = require('./database/init');

const PORT = process.env.PORT || 3001;

// Initialize the database before starting the server
try {
  initializeDatabase();
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
