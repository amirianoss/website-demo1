import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css';

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">MOVIELAND</Link>
      </div>
      <div className="nav-links">
        <Link to="/">HOME</Link>
        <Link to="/actors">ACTORS</Link>
        {user ? (
          <>
            <Link to="/favorites">FAVORITES</Link>
            <Link to="/watchlist">WATCHLIST</Link>
          </>
        ) : null}
        <Link to="/contact">CONTACT</Link>
        <div className="nav-user">
          {user ? (
            <>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
              </div>
              <button onClick={onLogout}>LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/login">LOGIN</Link>
              <Link to="/register">REGISTER</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;