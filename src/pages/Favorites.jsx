import React, { useState, useEffect } from 'react';
import MovieCard from '../componets/movicard';
import '../css/Favorites.css';

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    const loadFavorites = () => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
    };

    useEffect(() => {
        loadFavorites();
        // Add event listener for storage changes
        window.addEventListener('storage', loadFavorites);
        return () => window.removeEventListener('storage', loadFavorites);
    }, []);

    const handleFavoriteChange = (movieId) => {
        loadFavorites(); // Reload favorites after change
    };

    return (
        <div className="favorites-page">
            <h1>My Favorite Movies</h1>
            {favorites.length === 0 ? (
                <div className="no-favorites">
                    <p>You haven't added any movies to your favorites yet.</p>
                </div>
            ) : (
                <div className="movies-grid">
                    {favorites.map(movie => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onFavoriteChange={handleFavoriteChange}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;
