import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const NavBar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-brand">
        <Link to="/" onClick={closeMenu}>MOVIELAND</Link>
      </div>
      <button 
        className="hamburger" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu}>HOME</Link>
        <Link to="/actors" onClick={closeMenu}>ACTORS</Link>
        {user ? (
          <>
            <Link to="/favorites" onClick={closeMenu}>FAVORITES</Link>
            <Link to="/watchlist" onClick={closeMenu}>WATCHLIST</Link>
          </>
        ) : null}
        <Link to="/contact" onClick={closeMenu}>CONTACT</Link>
        <div className="nav-user">
          {user ? (
            <>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
              </div>
              <button onClick={() => { closeMenu(); onLogout(); }}>LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>LOGIN</Link>
              <Link to="/register" onClick={closeMenu}>REGISTER</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;