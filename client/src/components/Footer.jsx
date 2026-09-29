import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="navbar-logo">
            <span className="logo-icon">&lt;/&gt;</span>
            <span className="logo-text">Git Club CHARUSAT</span>
          </div>
          <p className="footer-desc">
            Empowering students through open source, collaboration, and community-driven learning.
          </p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/events">Upcoming Events</Link>
          <Link to="/past-events">Past Events</Link>
          <Link to="/about">About Us</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Git Club CHARUSAT. This is a hackathon project.</p>
      </div>
    </footer>
  );
}

export default Footer;
