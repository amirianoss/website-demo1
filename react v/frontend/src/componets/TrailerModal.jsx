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
                zIndex: 1000
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    position: 'relative',
                    width: '90%',
                    maxWidth: '900px',
                    aspectRatio: '16/9'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        border: 'none',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '20px',
                        zIndex: 1
                    }}
                >
                    ×
                </button>
                <iframe
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                    title="Movie Trailer"
                    frameBorder="0"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default TrailerModal;
