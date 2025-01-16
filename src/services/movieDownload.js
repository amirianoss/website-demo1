const API_KEY = 'f330d6cffe67147f7b99caf3f00e2dec';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMovieDownloadLink = async (movieId) => {
    try {
        // دریافت جزئیات فیلم و شناسه IMDB
        const movieResponse = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,external_ids`
        );
        const movieData = await movieResponse.json();

        // دریافت شناسه IMDB
        const imdbId = movieData.external_ids?.imdb_id;
        if (!imdbId) {
            throw new Error('شناسه IMDB یافت نشد');
        }

        // ساخت لینک‌های دانلود مستقیم
        const movieTitle = movieData.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        const releaseYear = movieData.release_date?.split('-')[0] || '';

        const downloadOptions = [
            {
                name: 'دانلود مستقیم (سرور 1)',
                url: `https://vidsrc.xyz/download/${imdbId}`,
                quality: '1080p',
                size: '~2.1 GB'
            },
            {
                name: 'دانلود مستقیم (سرور 2)',
                url: `https://streamtape.com/v/${imdbId}/${movieTitle}`,
                quality: '720p',
                size: '~1.4 GB'
            },
            {
                name: 'تماشای آنلاین (سرور 1)',
                url: `https://vidsrc.xyz/embed/movie/${imdbId}`,
                quality: 'HD',
                type: 'stream'
            },
            {
                name: 'تماشای آنلاین (سرور 2)',
                url: `https://dbgo.fun/imdb.php?id=${imdbId}`,
                quality: 'HD',
                type: 'stream'
            },
            {
                name: 'تماشای آنلاین (سرور 3)',
                url: `https://www.2embed.cc/embed/${imdbId}`,
                quality: 'HD',
                type: 'stream'
            }
        ];

        // اضافه کردن تریلر اگر موجود باشد
        const trailer = movieData.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
            downloadOptions.push({
                name: 'مشاهده تریلر',
                url: `https://www.youtube.com/watch?v=${trailer.key}`,
                type: 'trailer'
            });
        }

        return {
            title: movieData.title,
            imdbId,
            posterPath: movieData.poster_path 
                ? `https://image.tmdb.org/t/p/original${movieData.poster_path}` 
                : null,
            downloadOptions
        };
    } catch (error) {
        console.error('Error fetching movie download info:', error);
        throw new Error('خطا در دریافت اطلاعات دانلود');
    }
};
