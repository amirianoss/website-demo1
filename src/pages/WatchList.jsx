import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/WatchList.css';

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  const removeFromWatchlist = (movieId) => {
    const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (watchlist.length === 0) {
    return (
      <div className="watchlist-container empty">
        <h2>Your Watchlist is Empty</h2>
        <p>Add some movies to watch later!</p>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <h2>My Watchlist</h2>
      <div className="watchlist-grid">
        {watchlist.map(movie => (
          <div key={movie.id} className="movie-card">
            <div className="movie-image" onClick={() => handleMovieClick(movie.id)}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </div>
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.release_date?.split('-')[0]}</p>
              <div className="movie-rating">
                <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              </div>
              <button 
                className="remove-button"
                onClick={() => removeFromWatchlist(movie.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchList;
