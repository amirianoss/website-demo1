import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/watchlist.css';

const WatchList = ({ user }) => {
    const [lists, setLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [selectedList, setSelectedList] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadLists();
    }, [user, navigate]);

    const loadLists = () => {
        const savedLists = JSON.parse(localStorage.getItem(`watchlists_${user.id}`) || '[]');
        setLists(savedLists);
    };

    const createNewList = (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;

        const newList = {
            id: Date.now(),
            name: newListName,
            movies: []
        };

        const updatedLists = [...lists, newList];
        localStorage.setItem(`watchlists_${user.id}`, JSON.stringify(updatedLists));
        setLists(updatedLists);
        setNewListName('');
    };

    const deleteList = (listId) => {
        const updatedLists = lists.filter(list => list.id !== listId);
        localStorage.setItem(`watchlists_${user.id}`, JSON.stringify(updatedLists));
        setLists(updatedLists);
        if (selectedList?.id === listId) {
            setSelectedList(null);
        }
    };

    const removeMovieFromList = (listId, movieId) => {
        const updatedLists = lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    movies: list.movies.filter(movie => movie.id !== movieId)
                };
            }
            return list;
        });

        localStorage.setItem(`watchlists_${user.id}`, JSON.stringify(updatedLists));
        setLists(updatedLists);
        if (selectedList?.id === listId) {
            setSelectedList(updatedLists.find(list => list.id === listId));
        }
    };

    return (
        <div className="watchlist-container">
            <div className="lists-sidebar">
                <form onSubmit={createNewList} className="new-list-form">
                    <input 
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="New List Name"
                        className="new-list-input"
                    />
                    <button type="submit" className="create-list-btn">Create List</button>
                </form>
                
                <div className="lists-container">
                    {lists.map(list => (
                        <div 
                            key={list.id} 
                            className={`list-item ${selectedList?.id === list.id ? 'selected' : ''}`}
                            onClick={() => setSelectedList(list)}
                        >
                            <span className="list-name">{list.name}</span>
                            <span className="movie-count">{list.movies.length} movies</span>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteList(list.id);
                                }}
                                className="delete-list-btn"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="list-content">
                {selectedList ? (
                    <>
                        <h2>{selectedList.name}</h2>
                        <div className="movies-grid">
                            {selectedList.movies.map(movie => (
                                <div key={movie.id} className="movie-card">
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="movie-poster"
                                    />
                                    <div className="movie-info">
                                        <h3>{movie.title}</h3>
                                        <button 
                                            onClick={() => removeMovieFromList(selectedList.id, movie.id)}
                                            className="remove-movie-btn"
                                        >
                                            Remove from List
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-list-selected">
                        <h2>Select a list or create a new one</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchList;
