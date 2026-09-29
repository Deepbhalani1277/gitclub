import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">&lt;/&gt;</span>
          <span className="logo-text">Git Club</span>
        </Link>
        
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <NavLink to="/" className="nav-item" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/events" className="nav-item" onClick={closeMenu}>Events</NavLink>
          <NavLink to="/past-events" className="nav-item" onClick={closeMenu}>Past Events</NavLink>
          <NavLink to="/about" className="nav-item" onClick={closeMenu}>About</NavLink>
        </div>

        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
