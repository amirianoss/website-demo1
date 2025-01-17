import React, { useState, useEffect } from "react";
import { getMovieDownloadLink } from "../services/movieDownload";
import { getMovieDetails } from "../services/api";
import TrailerModal from "./TrailerModal";
import '../css/MovieCard.css';

const IMG_PATH = 'https://image.tmdb.org/t/p/w500/';
const API_KEY = 'f330d6cffe67147f7b99caf3f00e2dec'; 

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
        let newFavorites;
        
        if (isFavorite) {
            newFavorites = favorites.filter(fav => fav.id !== movie.id);
        } else {
            newFavorites = [...favorites, movie];
        }
        
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
        if (onFavoriteChange) {
            onFavoriteChange(movie.id);
        }
    };

    const openTrailer = async () => {
        try {
            const url = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`;
            console.log('Movie ID:', movie.id);
            console.log('Fetching URL:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Full API Response:', data);
            
            if (!data.results || data.results.length === 0) {
                console.log('No videos in response');
                alert('No trailer available for this movie.');
                return;
            }

            console.log('Available videos:', data.results);

            // Try to find official trailer first
            let trailer = data.results.find(
                video => video.type === "Trailer" && 
                        video.site === "YouTube" && 
                        video.official === true
            );

            // If no official trailer, try any trailer
            if (!trailer) {
                trailer = data.results.find(
                    video => video.type === "Trailer" && 
                            video.site === "YouTube"
                );
            }

            // If still no trailer, use the first video
            if (!trailer && data.results.length > 0) {
                trailer = data.results[0];
            }
            
            if (trailer) {
                console.log('Selected video for playback:', trailer);
                setTrailerKey(trailer.key);
                setShowTrailer(true);
            } else {
                console.log('No suitable video found');
                alert('No trailer available for this movie.');
            }
        } catch (error) {
            console.error('Detailed error:', error);
            alert('Error loading trailer. Please try again later.');
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

    const getRatingColor = (rating) => {
        if (rating >= 7) return 'green';
        if (rating >= 5) return 'orange';
        return 'red';
    };

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img 
                    src={movie.poster_path ? `${IMG_PATH}${movie.poster_path}` : '/placeholder.jpg'} 
                    alt={movie.title} 
                    loading="lazy"
                />
                <button
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={toggleFavorite}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <span>{isFavorite ? '❤️' : '🤍'}</span>
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
                <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-date">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                    </div>
                    <div className={`movie-rating ${getRatingColor(movie.vote_average)}`}>
                        {movie.vote_average?.toFixed(1)}
                    </div>
                    <div className="movie-actions">
                        <button 
                            className="watch-trailer-btn"
                            onClick={openTrailer}
                            aria-label="Watch trailer"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            Watch Trailer
                        </button>
                    </div>
                </div>
            </div>
            {showTrailer && trailerKey && (
                <TrailerModal
                    videoKey={trailerKey}
                    onClose={() => {
                        setShowTrailer(false);
                        setTrailerKey(null);
                    }}
                />
            )}
        </div>
    );
};

export default MovieCard;