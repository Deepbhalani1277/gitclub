import { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

function PastEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents({ type: 'past' });
        setEvents(data);
      } catch (error) {
        console.error('Error fetching past events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);

  return (
    <div className="events-page container">
      <div className="page-header">
        <h1>Past Events</h1>
        <p>Explore what we've been up to.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : events.length > 0 ? (
        <div className="events-grid">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No past events" 
          message="There are no past events to display yet."
        />
      )}
    </div>
  );
}

export default PastEvents;
