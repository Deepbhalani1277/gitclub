import { useState, useEffect } from 'react';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './Events.css';

const CATEGORIES = ['All', 'Workshop', 'Hackathon', 'Competition', 'Meetup', 'Collaboration'];

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const catParam = category === 'All' ? '' : category;
        const data = await fetchEvents({ 
          type: 'upcoming', 
          search: debouncedSearch, 
          category: catParam 
        });
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [debouncedSearch, category]);

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
  };

  return (
    <div className="events-page container">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Discover workshops, meetups, and hackathons.</p>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search events by title or keywords..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
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
          title="No events found" 
          message="Try adjusting your search or category filters to find what you're looking for."
          actionText="Clear Filters"
          onAction={resetFilters}
        />
      )}
    </div>
  );
}

export default Events;
