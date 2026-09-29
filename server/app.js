const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const eventsRouter = require('./routes/events');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/events', eventsRouter);

app.use(errorHandler);

module.exports = app;
