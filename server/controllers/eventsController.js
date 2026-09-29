const db = require('../database/connection');

// Derived fields calculation helper
function enrichEventData(event, registrationCount) {
  const isCancelled = event.status === 'cancelled';
  const isPast = new Date(event.date) < new Date(new Date().toISOString().split('T')[0]);
  
  const hasDeadlinePassed = event.reg_deadline 
    ? new Date(event.reg_deadline) < new Date(new Date().toISOString().split('T')[0]) 
    : false;
    
  const spotsRemaining = event.max_capacity !== null 
    ? event.max_capacity - registrationCount 
    : null;
    
  const isFull = spotsRemaining !== null && spotsRemaining <= 0;
  
  const isRegistrationOpen = !isPast && !isCancelled && !hasDeadlinePassed && !isFull;

  return {
    ...event,
    registration_count: registrationCount,
    spots_remaining: spotsRemaining,
    is_registration_open: isRegistrationOpen
  };
}

exports.getEvents = (req, res) => {
  const { type = 'upcoming', search, category } = req.query;
  const today = new Date().toISOString().split('T')[0];
  
  let query = 'SELECT * FROM events WHERE ';
  const params = [];
  
  if (type === 'past') {
    query += 'date < ?';
    params.push(today);
  } else {
    // upcoming
    query += 'date >= ?';
    params.push(today);
  }
  
  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY date ' + (type === 'past' ? 'DESC' : 'ASC');
  
  const stmt = db.prepare(query);
  const events = stmt.all(params);
  
  const enrichedEvents = events.map(event => {
    const regStmt = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE event_id = ?');
    const { count } = regStmt.get(event.id);
    return enrichEventData(event, count);
  });
  
  res.json(enrichedEvents);
};

exports.getEventById = (req, res) => {
  const { id } = req.params;
  
  const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
  const event = stmt.get(id);
  
  if (!event) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }
  
  const regStmt = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE event_id = ?');
  const { count } = regStmt.get(id);
  
  res.json(enrichEventData(event, count));
};

exports.registerForEvent = (req, res) => {
  const { id } = req.params;
  const { student_name, email, department } = req.body;
  
  if (!student_name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }
  
  if (!/^\\S+@\\S+\\.\\S+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }
  
  const registerTransaction = db.transaction(() => {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = stmt.get(id);
    
    if (!event) {
      throw new Error('NOT_FOUND');
    }
    
    const regStmt = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE event_id = ?');
    const { count } = regStmt.get(id);
    
    const enriched = enrichEventData(event, count);
    
    if (!enriched.is_registration_open) {
      throw new Error('CLOSED');
    }
    
    const insertStmt = db.prepare(`
      INSERT INTO registrations (event_id, student_name, email, department)
      VALUES (?, ?, ?, ?)
    `);
    
    insertStmt.run(id, student_name, email, department || null);
  });
  
  try {
    registerTransaction();
    res.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    if (error.message === 'CLOSED') {
      return res.status(400).json({ success: false, error: 'Registration is closed for this event' });
    }
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ success: false, error: 'A registration with this email already exists for this event' });
    }
    throw error;
  }
};
