import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import '../css/MovieDetail.css';

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const data = await getMovieDetails(id);
                setMovie(data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return <div className="loading">در حال بارگذاری...</div>;
    }

    if (!movie) {
        return <div className="error">فیلم پیدا نشد</div>;
    }

    return (
        <div className="movie-details">
            <div className="movie-header">
                <div className="movie-backdrop" style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                }}>
                    <div className="backdrop-overlay"></div>
                </div>
                
                <div className="movie-content">
                    <div className="movie-poster">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                    </div>

                    <div className="movie-info">
                        <h1>{movie.title}</h1>
                        
                        <div className="movie-meta">
                            <span className="release-date">{movie.release_date?.split('-')[0]}</span>
                            <span className="runtime">{movie.runtime} دقیقه</span>
                            <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                        </div>

                        <div className="genres">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="genre-tag">
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <div className="overview">
                            <h3>خلاصه داستان</h3>
                            <p>{movie.overview}</p>
                        </div>

                        {movie.credits?.cast && (
                            <div className="cast">
                                <h3>بازیگران</h3>
                                <div className="cast-list">
                                    {movie.credits.cast.slice(0, 5).map(actor => (
                                        <div key={actor.id} className="cast-item">
                                            {actor.profile_path ? (
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                    alt={actor.name}
                                                />
                                            ) : (
                                                <div className="no-image">تصویر موجود نیست</div>
                                            )}
                                            <p>{actor.name}</p>
                                            <span className="character">{actor.character}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {movie.videos?.results?.length > 0 && (
                            <div className="trailer">
                                <h3>تریلر</h3>
                                <div className="video-container">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                                        title="Movie Trailer"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;
