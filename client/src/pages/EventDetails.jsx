import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEventById } from '../services/api';
import RegistrationForm from '../components/RegistrationForm';
import LoadingSpinner from '../components/LoadingSpinner';
import './EventDetails.css';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        setError('Event not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    
    loadEvent();
  }, [id]);

  const handleRegistrationSuccess = () => {
    setRegistered(true);
    // Reload event to update spots remaining
    fetchEventById(id).then(setEvent).catch(console.error);
  };

  if (loading) return <div className="container" style={{paddingTop: '4rem'}}><LoadingSpinner /></div>;
  
  if (error) return (
    <div className="container event-details-error">
      <h2>Oops!</h2>
      <p>{error}</p>
      <Link to="/events" className="btn btn-secondary">Back to Events</Link>
    </div>
  );

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="event-details-page container">
      <Link to="/events" className="back-link">&larr; Back to Events</Link>
      
      <div className="event-details-layout">
        <div className="event-main">
          <div className="event-header">
            <span className="category-tag">{event.category}</span>
            <h1 className="event-title">{event.title}</h1>
          </div>
          
          <div className="event-meta-banner">
            <div className="meta-block">
              <span className="meta-label">Date & Time</span>
              <span className="meta-value">{formattedDate}</span>
              <span className="meta-subtext">
                {event.start_time} {event.end_time ? `- ${event.end_time}` : ''}
              </span>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-block">
              <span className="meta-label">Location</span>
              <span className="meta-value">{event.venue}</span>
            </div>
          </div>
          
          <div className="event-description">
            <h2>About this event</h2>
            <p>{event.description}</p>
          </div>
        </div>
        
        <div className="event-sidebar">
          {registered ? (
            <div className="success-banner">
              <div className="success-icon">🎉</div>
              <h3>You're Registered!</h3>
              <p>We've successfully recorded your registration for this event.</p>
            </div>
          ) : (
            <div className="registration-section">
              <div className="registration-header">
                <h2>Registration</h2>
                {event.spots_remaining !== null && (
                  <span className="spots-count">{event.spots_remaining} spots left</span>
                )}
              </div>
              
              {!event.is_registration_open ? (
                <div className="registration-closed">
                  <p>Registration is currently closed for this event.</p>
                </div>
              ) : (
                <RegistrationForm eventId={event.id} onSuccess={handleRegistrationSuccess} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
