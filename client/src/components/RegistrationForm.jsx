import { useState } from 'react';
import { registerForEvent } from '../services/api';
import './RegistrationForm.css';

function RegistrationForm({ eventId, onSuccess }) {
  const [formData, setFormData] = useState({
    student_name: '',
    email: '',
    department: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    if (error) setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await registerForEvent(eventId, formData);
      setFormData({ student_name: '', email: '', department: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="student_name">Full Name <span className="required">*</span></label>
        <input 
          type="text" 
          id="student_name"
          name="student_name"
          value={formData.student_name}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={100}
          placeholder="e.g. Aarav Patel"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address <span className="required">*</span></label>
        <input 
          type="email" 
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="student@charusat.edu.in"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="department">Department (Optional)</label>
        <input 
          type="text" 
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          maxLength={100}
          placeholder="e.g. Computer Science"
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary submit-btn" 
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Complete Registration'}
      </button>
    </form>
  );
}

export default RegistrationForm;
