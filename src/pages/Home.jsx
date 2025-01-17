import React, { useState, useEffect } from "react"
import MovieCard from "../componets/movicard"
import "../css/Home.css"
import { searchMovies, getPopularMovies } from "../services/api";


function Home() {

const [searchQuery, setSearchQuery] = useState("");
const [movies, setMovies] = useState([]);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);
useEffect (() => {

const loadPopularMovies = async () => {

try {
const popularMovies = await getPopularMovies();
setMovies(popularMovies);
} catch (err) {
setError("fail to load movies");
console.log(err);

}
finally {
setLoading(false);
}



}
loadPopularMovies();


},[])

    const HandleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        if  (loading) return
setLoading(true)

try {
console.log('Starting search for:', searchQuery);
const searchResults = await searchMovies(searchQuery);
console.log('Got search results:', searchResults);
            
if (!searchResults || searchResults.length === 0) {
setError("No movies found");
setMovies([]);
} else {
setMovies(searchResults);
setError(null);
}
} catch (err) {
console.log('Search error:', err);
setError("Failed to load movies");
setMovies([]);
}finally{
setLoading(false)



        }
    };
return (


<div className="home">

    <form className="search-form" onSubmit={HandleSearch}>


    <input type="text" className="search-input" placeholder="Search for movies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
   <button type="submit" className="search-button">Search</button> 
    </form>


{error && <div className="error-message">{error}</div>}

{loading ? <div className="loading">Loading...</div> : <div className="movies-grid">
{movies.map((movie) => (
    <MovieCard movie={movie} key={movie.id} />
))}
</div>}


</div>

);

}
export default Home