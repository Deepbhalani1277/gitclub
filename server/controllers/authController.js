const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon-super-secret-key';

// Hardcoded admin credentials for hackathon
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, error: 'Invalid username or password' });
};
