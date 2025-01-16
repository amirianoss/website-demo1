import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './css/App.css';
import './css/themes.css';
import './css/responsive.css';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Actors from './pages/Actors';
import NavBar from './componets/NavBar';
import ThemeToggle from './componets/ThemeToggle';
import WatchList from './pages/WatchList';

export const AuthContext = createContext(null);

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // محافظت از مسیرهای خصوصی
  const PrivateRoute = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="app">
        <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
        <NavBar user={currentUser} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/favorites" 
              element={
                <PrivateRoute>
                  <Favorites />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/watchlist" 
              element={
                <PrivateRoute>
                  <WatchList user={currentUser} />
                </PrivateRoute>
              } 
            />
            <Route path="/actors" element={<Actors />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
