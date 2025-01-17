import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MovieCard.css';

const MovieCard = ({ movie }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setIsInWatchlist(watchlist.some(item => item.id === movie.id));
  }, [movie.id]);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (isInWatchlist) {
      const updatedWatchlist = watchlist.filter(item => item.id !== movie.id);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsInWatchlist(false);
    } else {
      const updatedWatchlist = [...watchlist, movie];
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsInWatchlist(true);
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
        <button 
          className={`favorite-btn ${isInWatchlist ? 'active' : ''}`}
          onClick={handleWatchlistClick}
        >
          <span className="material-icons">
            {isInWatchlist ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="release-date">{movie.release_date?.split('-')[0]}</p>
        <div className="movie-rating">
          <span>⭐ {movie.vote_average?.toFixed(1)}</span>
        </div>
        <p className="overview">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;
