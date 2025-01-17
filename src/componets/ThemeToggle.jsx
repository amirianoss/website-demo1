import React from 'react';
import '../css/ThemeToggle.css';

function ThemeToggle({ isDark, onToggle }) {
    return (
        <button 
            className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
            onClick={onToggle}
            title={isDark ? 'تغییر به حالت روز' : 'تغییر به حالت شب'}
        >
            <span className="icon">
                {isDark ? '🌙' : '☀️'}
            </span>
        </button>
    );
}

export default ThemeToggle;
