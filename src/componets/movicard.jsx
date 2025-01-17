import React, { useState, useEffect } from "react";
import { getMovieDownloadLink } from "../services/movieDownload";
import { getMovieDetails } from "../services/api";
import TrailerModal from "./TrailerModal";
import "../css/MovieCard.css";

const IMG_PATH = 'https://image.tmdb.org/t/p/w500/';

const MovieCard = ({movie, onFavoriteChange}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [downloadInfo, setDownloadInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);
    const [trailerKey, setTrailerKey] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [showListOptions, setShowListOptions] = useState(false);

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.some(fav => fav.id === movie.id));
    }, [movie.id]);

    const handleMovieClick = async () => {
        try {
            const details = await getMovieDetails(movie.id);
            const trailer = details.videos.find(
                video => video.type === "Trailer" && video.site === "YouTube"
            );
            if (trailer) {
                setTrailerKey(trailer.key);
                setShowTrailer(true);
            } else {
                alert('تریلر این فیلم موجود نیست');
            }
        } catch (error) {
            console.error('Error loading trailer:', error);
            alert('خطا در بارگذاری تریلر');
        }
    };

    const handleDownloadClick = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        try {
            const info = await getMovieDownloadLink(movie.id);
            setDownloadInfo(info);
            setShowDownloadOptions(true);
        } catch (error) {
            console.error('Error getting download info:', error);
            alert('خطا در دریافت اطلاعات دانلود فیلم');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = (option) => {
        if (option.type === 'stream') {
            const streamWindow = window.open('', '_blank');
            streamWindow.document.write(`
                <html>
                    <head>
                        <title>تماشای ${downloadInfo.movieTitle}</title>
                        <style>
                            body, html {
                                margin: 0;
                                padding: 0;
                                height: 100vh;
                                width: 100vw;
                                overflow: hidden;
                                background: #000;
                            }
                            iframe {
                                width: 100%;
                                height: 100%;
                                border: none;
                            }
                        </style>
                    </head>
                    <body>
                        <iframe
                            src="${option.url}"
                            allowfullscreen
                            allow="autoplay; fullscreen"
                        ></iframe>
                    </body>
                </html>
            `);
            streamWindow.document.close();
        } else {
            window.open(option.url, '_blank');
        }
        setShowDownloadOptions(false);
    };

    const handleAddToList = (listId) => {
        const userId = JSON.parse(localStorage.getItem('currentUser'))?.id;
        if (!userId) return;

        const lists = JSON.parse(localStorage.getItem(`watchlists_${userId}`) || '[]');
        const updatedLists = lists.map(list => {
            if (list.id === listId) {
                // Check if movie is already in the list
                if (!list.movies.some(m => m.id === movie.id)) {
                    return {
                        ...list,
                        movies: [...list.movies, movie]
                    };
                }
            }
            return list;
        });

        localStorage.setItem(`watchlists_${userId}`, JSON.stringify(updatedLists));
        setShowListOptions(false);
    };

    const ListOptionsPopup = () => {
        const userId = JSON.parse(localStorage.getItem('currentUser'))?.id;
        const lists = JSON.parse(localStorage.getItem(`watchlists_${userId}`) || '[]');

        return (
            <div className="list-options-popup">
                <h3>Add to List</h3>
                {lists.length === 0 ? (
                    <p>No lists created yet</p>
                ) : (
                    lists.map(list => (
                        <button
                            key={list.id}
                            onClick={() => handleAddToList(list.id)}
                            className="list-option-btn"
                        >
                            {list.name}
                        </button>
                    ))
                )}
                <button 
                    className="close-popup-btn"
                    onClick={() => setShowListOptions(false)}
                >
                    Close
                </button>
            </div>
        );
    };

    const toggleFavorite = (e) => {
        e.stopPropagation();
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isCurrentlyFavorite = favorites.some(fav => fav.id === movie.id);
        
        let updatedFavorites;
        if (isCurrentlyFavorite) {
            updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
        } else {
            // Make sure we're adding all necessary movie data
            const movieToAdd = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                overview: movie.overview
            };
            updatedFavorites = [...favorites, movieToAdd];
        }
        
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(!isCurrentlyFavorite);
        
        if (onFavoriteChange) {
            onFavoriteChange(movie.id);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fa-IR', options);
    };

    const formatVoteAverage = (vote) => {
        return vote.toFixed(1);
    };

    const getClassByRate = (vote) => {
        if (vote >= 8) return 'green';
        if (vote >= 5) return 'orange';
        return 'red';
    };

    return (
        <div className="movie-card" onClick={handleMovieClick}>
            <div className="movie-poster">
                <img 
                    src={movie.poster_path ? `${IMG_PATH}${movie.poster_path}` : '/placeholder.jpg'} 
                    alt={movie.title} 
                />
                <button 
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`} 
                    onClick={toggleFavorite}
                >
                    <span>♥</span>
                </button>
                {showDownloadOptions && downloadInfo && (
                    <div className="download-options">
                        {downloadInfo.map((link, index) => (
                            <a 
                                key={index}
                                href={link.url}
                                className="download-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                دانلود {link.quality}
                            </a>
                        ))}
                    </div>
                )}
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-meta">
                    <span className="movie-rating">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="movie-year">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                    </span>
                </div>
            </div>
            {showTrailer && trailerKey && (
                <TrailerModal
                    trailerKey={trailerKey}
                    onClose={() => setShowTrailer(false)}
                />
            )}
        </div>
    );
};

export default MovieCard;