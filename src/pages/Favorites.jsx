import { useState, useEffect } from 'react';
import MovieCard from '../componets/movicard';
import '../css/Favorites.css';

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Initial load
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
    }, []);

    const handleFavoriteChange = (movieId) => {
        // Immediately remove the movie from state
        setFavorites(currentFavorites => {
            const updatedFavorites = currentFavorites.filter(movie => movie.id !== movieId);
            // Update localStorage after state update
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
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
                            onFavoriteChange={() => handleFavoriteChange(movie.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorites;
