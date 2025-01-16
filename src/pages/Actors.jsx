import React, { useEffect, useState } from 'react';
import { getPopularActors, getActorDetails, searchActors } from '../services/api';
import '../css/actors.css';

const IMG_PATH = 'https://image.tmdb.org/t/p/w500/';

function Actors() {
    const [actors, setActors] = useState([]);
    const [selectedActor, setSelectedActor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchActors();
    }, []);

    const fetchActors = async () => {
        try {
            const data = await getPopularActors();
            setActors(data);
        } catch (error) {
            console.error('Error fetching actors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchActors();
            return;
        }
        
        setLoading(true);
        try {
            const results = await searchActors(searchQuery);
            setActors(results);
        } catch (error) {
            console.error('Error searching actors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleActorClick = async (actorId) => {
        try {
            const details = await getActorDetails(actorId);
            setSelectedActor(details);
        } catch (error) {
            console.error('Error fetching actor details:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="actors-container">
            <div className="search-container">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search for actors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>
            </div>
            
            <h1>Popular Actors</h1>
            <div className="actors-grid">
                {actors.map(actor => (
                    <div 
                        key={actor.id} 
                        className="actor-card"
                        onClick={() => handleActorClick(actor.id)}
                    >
                        <img 
                            src={actor.profile_path ? `${IMG_PATH}${actor.profile_path}` : '/placeholder.jpg'} 
                            alt={actor.name}
                            className="actor-image"
                        />
                        <div className="actor-info">
                            <h3>{actor.name}</h3>
                            <p>Known for: {actor.known_for_department}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedActor && (
                <div className="actor-details-modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setSelectedActor(null)}>×</button>
                        <div className="actor-details">
                            <img 
                                src={selectedActor.profile_path ? `${IMG_PATH}${selectedActor.profile_path}` : '/placeholder.jpg'} 
                                alt={selectedActor.name}
                                className="actor-detail-image"
                            />
                            <div className="actor-info-detailed">
                                <h2>{selectedActor.name}</h2>
                                <p><strong>Birthday:</strong> {selectedActor.birthday}</p>
                                <p><strong>Place of Birth:</strong> {selectedActor.place_of_birth}</p>
                                <p><strong>Biography:</strong> {selectedActor.biography}</p>
                                <h3>Known For</h3>
                                <div className="known-for-movies">
                                    {selectedActor.movie_credits?.cast?.slice(0, 5).map(movie => (
                                        <div key={movie.id} className="movie-item">
                                            <img 
                                                src={movie.poster_path ? `${IMG_PATH}${movie.poster_path}` : '/placeholder.jpg'} 
                                                alt={movie.title}
                                            />
                                            <p>{movie.title}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Actors;
