import React from 'react';
import { Link } from 'react-router-dom';
import "../css/navbar.css";

function NavBar({ user, onLogout }) {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="nav-title">🎬 Movies</Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/favorites" className="nav-link">Favorites</Link>
                <Link to="/watchlist" className="nav-link">My Lists</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
                <Link to="/actors" className="nav-link">Actors</Link>
                {user ? (
                    <div className="user-menu">
                        <span className="username">{user.name}</span>
                        <button onClick={onLogout} className="logout-btn">
                            <span className="material-icons">logout</span>
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link register-btn">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;