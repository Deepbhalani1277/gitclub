import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, createEvent } from '../services/api';
import { isAuthenticated, removeToken } from '../services/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import './Admin.css';

const CATEGORIES = ['Workshop', 'Hackathon', 'Competition', 'Meetup', 'Collaboration'];

function AdminDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Workshop',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    venue: '',
    max_capacity: '',
    reg_deadline: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadEvents();
  }, [navigate]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents({ type: 'upcoming' });
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    // Format numbers
    const submitData = {
      ...formData,
      max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : null,
      end_time: formData.end_time || null,
      reg_deadline: formData.reg_deadline || null
    };

    try {
      await createEvent(submitData);
      setSuccessMsg('Event added successfully!');
      setShowAddForm(false);
      setFormData({
        title: '', category: 'Workshop', description: '', date: '', 
        start_time: '', end_time: '', venue: '', max_capacity: '', reg_deadline: ''
      });
      loadEvents(); // refresh list
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add event');
    }
  };

  if (loading && events.length === 0) return <div className="container" style={{paddingTop: '4rem'}}><LoadingSpinner /></div>;

  return (
    <div className="admin-dashboard container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>

      {successMsg && <div className="success-banner mb-4">🎉 {successMsg}</div>}
      {errorMsg && <div className="form-error mb-4">{errorMsg}</div>}

      <div className="admin-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel Add Event' : '+ Add New Event'}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-add-form-container">
          <h2>Create New Event</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Event Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group flex-1">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="admin-select" required>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="form-group flex-1">
                <label>Start Time *</label>
                <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} required />
              </div>
              <div className="form-group flex-1">
                <label>End Time</label>
                <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-2">
                <label>Venue *</label>
                <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} required />
              </div>
              <div className="form-group flex-1">
                <label>Max Capacity</label>
                <input type="number" name="max_capacity" value={formData.max_capacity} onChange={handleInputChange} placeholder="Leave empty for unlimited" />
              </div>
            </div>
            
            <div className="form-group" style={{maxWidth: '300px'}}>
              <label>Registration Deadline</label>
              <input type="date" name="reg_deadline" value={formData.reg_deadline} onChange={handleInputChange} />
            </div>

            <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>Publish Event</button>
          </form>
        </div>
      )}

      <div className="admin-events-list">
        <h2>Upcoming Events ({events.length})</h2>
        <div className="events-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Category</th>
                <th>Registrations</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td><span className="category-tag">{event.category}</span></td>
                  <td>{event.registration_count} {event.max_capacity ? `/ ${event.max_capacity}` : ''}</td>
                  <td>{event.is_registration_open ? 'Open' : 'Closed'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
