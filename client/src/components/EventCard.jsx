import { Link } from 'react-router-dom';
import './EventCard.css';

function EventCard({ event }) {
  const { 
    id, 
    title, 
    category, 
    description, 
    date, 
    start_time, 
    venue, 
    is_registration_open,
    spots_remaining,
    status
  } = event;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getStatusBadge = () => {
    if (status === 'cancelled') {
      return <span className="badge badge-danger">Cancelled</span>;
    }
    if (!is_registration_open && new Date(date) < new Date(new Date().toISOString().split('T')[0])) {
      return <span className="badge badge-muted">Past</span>;
    }
    if (!is_registration_open) {
      return <span className="badge badge-danger">Closed</span>;
    }
    if (spots_remaining !== null && spots_remaining <= 5) {
      return <span className="badge badge-warning">Only {spots_remaining} spots</span>;
    }
    return <span className="badge badge-success">Open</span>;
  };

  return (
    <div className="event-card">
      <div className="card-header">
        <span className="category-tag">{category}</span>
        {getStatusBadge()}
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description.length > 100 ? description.substring(0, 100) + '...' : description}</p>
      </div>
      <div className="card-footer">
        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span> {formattedDate} at {start_time}
          </div>
          <div className="meta-item">
            <span className="meta-icon">📍</span> {venue}
          </div>
        </div>
        <Link to={`/events/${id}`} className="btn btn-secondary card-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
