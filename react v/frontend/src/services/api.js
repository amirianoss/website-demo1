const API_KEY = "f330d6cffe67147f7b99caf3f00e2dec";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    return data.results;
};

export const searchMovies = async (query) => {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
};

export const getMovieDetails = async (movieId) => {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,similar,recommendations,keywords&language=en-US`
    );
    const data = await response.json();
    return {
        ...data,
        genres: data.genres || [],
        runtime: data.runtime || 0,
        release_date: data.release_date || '',
        overview: data.overview || '',
        vote_average: data.vote_average || 0,
        production_companies: data.production_companies || [],
        spoken_languages: data.spoken_languages || [],
        budget: data.budget || 0,
        revenue: data.revenue || 0,
        status: data.status || '',
        tagline: data.tagline || '',
        credits: {
            cast: data.credits?.cast || [],
            crew: data.credits?.crew || []
        },
        videos: data.videos?.results || [],
        similar: data.similar?.results || [],
        recommendations: data.recommendations?.results || []
    };
};

export const getMovieGenres = async () => {
    const response = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.genres;
};

export const getMoviesByGenre = async (genreId, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&language=en-US`
    );
    const data = await response.json();
    return data.results;
};

export const getPopularActors = async (page = 1) => {
    const response = await fetch(
        `${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    const data = await response.json();
    return data.results;
};

export const getActorDetails = async (personId) => {
    const response = await fetch(
        `${BASE_URL}/person/${personId}?api_key=${API_KEY}&append_to_response=movie_credits&language=en-US`
    );
    const data = await response.json();
    return {
        ...data,
        movie_credits: data.movie_credits || { cast: [], crew: [] }
    };
};

export const searchActors = async (query) => {
    const response = await fetch(
        `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
};