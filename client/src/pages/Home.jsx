import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents({ type: 'upcoming' });
        setEvents(data.slice(0, 3)); // Only show top 3 upcoming events
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);

  const featuredEvent = events.length > 0 ? events[0] : null;
  const otherEvents = events.length > 1 ? events.slice(1) : [];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Code, Collaborate, <span className="text-accent">Create.</span>
            </h1>
            <p className="hero-subtitle">
              Join the Git Club CHARUSAT to level up your development skills, contribute to open source, and meet fellow student developers.
            </p>
            <div className="hero-actions">
              <Link to="/events" className="btn btn-primary btn-lg">Explore Events</Link>
              <Link to="/about" className="btn btn-secondary btn-lg">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-section container">
        <div className="section-header">
          <h2>Featured Upcoming Event</h2>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : featuredEvent ? (
          <div className="featured-card">
            <div className="featured-content">
              <span className="category-tag">{featuredEvent.category}</span>
              <h3>{featuredEvent.title}</h3>
              <p>{featuredEvent.description}</p>
              <div className="featured-meta">
                <span>📅 {new Date(featuredEvent.date).toLocaleDateString()}</span>
                <span>📍 {featuredEvent.venue}</span>
              </div>
              <Link to={`/events/${featuredEvent.id}`} className="btn btn-primary mt-4">
                View & Register
              </Link>
            </div>
          </div>
        ) : (
          <div className="no-events-banner">
            <p>No upcoming events currently scheduled.</p>
          </div>
        )}
      </section>

      {otherEvents.length > 0 && (
        <section className="more-events-section container">
          <div className="section-header">
            <h2>More Upcoming Events</h2>
            <Link to="/events" className="view-all-link">View all &rarr;</Link>
          </div>
          <div className="events-grid">
            {otherEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <section className="about-teaser container">
        <div className="teaser-content">
          <h2>Why join Git Club?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h3>🚀 Learn Modern Tech</h3>
              <p>Workshops on version control, web dev, and cloud deployment.</p>
            </div>
            <div className="benefit-card">
              <h3>🤝 Build Network</h3>
              <p>Connect with peers, seniors, and alumni in the tech industry.</p>
            </div>
            <div className="benefit-card">
              <h3>🏆 Hack & Compete</h3>
              <p>Participate in hackathons and coding challenges.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
