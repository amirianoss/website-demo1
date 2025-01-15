import React, { useState } from 'react';
import '../css/SearchBox.css';

const SearchBox = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className={`search-form ${isFocused ? 'focused' : ''}`}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="جستجوی فیلم..."
                    className="search-input"
                />
                <button type="submit" className="search-button" disabled={!searchTerm.trim()}>
                    <span className="material-icons">search</span>
                </button>
            </form>
            {searchTerm && (
                <button 
                    className="clear-button"
                    onClick={() => setSearchTerm('')}
                    type="button"
                >
                    <span className="material-icons">close</span>
                </button>
            )}
        </div>
    );
};

export default SearchBox;
