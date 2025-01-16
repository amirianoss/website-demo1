import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import '../css/MovieDetail.css';

function MovieDetail() {
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
        <div className="movie-detail">
            <div className="movie-header" style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            }}>
                <div className="overlay"></div>
                <div className="movie-poster">
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                </div>
                <div className="movie-title">
                    <h1>{movie.title}</h1>
                    <div className="movie-info">
                        <span>{movie.release_date?.split('-')[0]}</span>
                        <span>{movie.runtime} دقیقه</span>
                        <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                    </div>
                </div>
            </div>

            <div className="movie-content">
                <div className="movie-section">
                    <h2>خلاصه داستان</h2>
                    <p>{movie.overview}</p>
                </div>

                {movie.credits?.cast && (
                    <div className="movie-section">
                        <h2>بازیگران</h2>
                        <div className="cast-list">
                            {movie.credits.cast.slice(0, 6).map(actor => (
                                <div key={actor.id} className="cast-item">
                                    {actor.profile_path ? (
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                            alt={actor.name}
                                        />
                                    ) : (
                                        <div className="actor-placeholder">
                                            {actor.name.charAt(0)}
                                        </div>
                                    )}
                                    <h3>{actor.name}</h3>
                                    <p>{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {movie.videos?.results?.length > 0 && (
                    <div className="movie-section">
                        <h2>تریلر</h2>
                        <div className="trailer">
                            <iframe
                                src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                                title="Movie Trailer"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {movie.similar?.results?.length > 0 && (
                    <div className="movie-section">
                        <h2>فیلم‌های مشابه</h2>
                        <div className="similar-movies">
                            {movie.similar.results.slice(0, 6).map(similarMovie => (
                                <div key={similarMovie.id} className="similar-movie">
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w200${similarMovie.poster_path}`}
                                        alt={similarMovie.title}
                                    />
                                    <h3>{similarMovie.title}</h3>
                                    <p>{similarMovie.release_date?.split('-')[0]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetail;
