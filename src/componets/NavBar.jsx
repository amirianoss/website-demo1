import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css';

function NavBar({ user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <div className="navbar-brand">
        <Link to="/" className="nav-title">🎬 Movies</Link>
      </div>

      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="navbar-links">
        <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
        <Link to="/actors" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Actors</Link>
        {user ? (
          <>
            <Link to="/favorites" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Favorites</Link>
            <Link to="/watchlist" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>My Lists</Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <div className="user-menu">
              <span className="username">{user.name}</span>
              <button className="logout-btn" onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }}>
                <span className="material-icons">logout</span>
              </button>
            </div>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            <Link to="/register" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;