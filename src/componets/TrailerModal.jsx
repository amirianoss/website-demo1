import React from 'react';
import ReactDOM from 'react-dom';

const TrailerModal = ({ videoKey, onClose }) => {
    if (!videoKey) return null;

    const modalContent = (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '20px'
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    position: 'relative',
                    width: '90%',
                    maxWidth: '900px',
                    aspectRatio: '16/9',
                    background: '#000'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '0',
                        background: 'transparent',
                        color: 'white',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        fontSize: '24px',
                        zIndex: 1
                    }}
                >
                    ×
                </button>
                <iframe
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
                    title="Movie Trailer"
                    frameBorder="0"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('root'));
};

export default TrailerModal;
