import { useState, useEffect } from "react";
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

    function toggleFavorite(e) {
        e.stopPropagation();
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (isFavorite) {
            const newFavorites = favorites.filter(fav => fav.id !== movie.id);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            setIsFavorite(false);
            if (onFavoriteChange) {
                onFavoriteChange();
            }
        } else {
            const newFavorites = [...favorites, movie];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            setIsFavorite(true);
        }
    }

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
        <>
            <div className="movie-card">
                <div className="movie-poster" onClick={handleMovieClick}>
                    <img 
                        src={IMG_PATH + movie.poster_path} 
                        alt={movie.title}
                    />
                    <button 
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        onClick={toggleFavorite}
                        title={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                    >
                        <span>{isFavorite ? '❤️' : '🤍'}</span>
                    </button>
                    <div className="movie-overlay">
                        <div className="movie-details">
                            <h2>{movie.title}</h2>
                            <p>{movie.overview}</p>
                        </div>
                    </div>
                </div>
                <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <span className={`rating ${getClassByRate(movie.vote_average)}`}>
                        {movie.vote_average}
                    </span>
                </div>
                <div className="movie-actions">
                    <button
                        onClick={() => setShowListOptions(true)}
                        className="add-to-list-btn"
                        title="Add to List"
                    >
                        <span className="material-icons">playlist_add</span>
                    </button>
                </div>
                <div className="buttons-container">
                </div>
                <div className="movie-info">
                    <p className="release-date">تاریخ انتشار: {formatDate(movie.release_date)}</p>
                    <p className="vote-average">امتیاز: {formatVoteAverage(movie.vote_average)}</p>
                    <p className="overview">{movie.overview}</p>
                    <button 
                        className={`download-btn ${isLoading ? 'loading' : ''}`}
                        onClick={handleDownloadClick}
                        disabled={isLoading}
                        title="دانلود فیلم"
                    >
                        <span className="download-icon">
                            {isLoading ? '⏳' : '📥'}
                        </span>
                        دانلود
                    </button>
                    <button 
                        className="download-btn"
                        onClick={handleMovieClick}
                        style={{ marginTop: '10px' }}
                    >
                        <span className="download-icon">🎬</span>
                        TRAILER
                    </button>
                </div>
                {showListOptions && <ListOptionsPopup />}
            </div>
            {showTrailer && (
                <TrailerModal 
                    videoKey={trailerKey} 
                    onClose={() => {
                        setShowTrailer(false);
                        setTrailerKey(null);
                    }}
                />
            )}
        </>
    );
};

export default MovieCard;