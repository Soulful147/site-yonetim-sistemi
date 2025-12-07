import React from 'react';

const Loader = ({ size = 'md', className = '' }) => {
    const sizeClass = size !== 'md' ? `loader-${size}` : '';

    return (
        <div className="flex justify-center items-center" style={{ padding: 'var(--spacing-xl)' }}>
            <div className={`loader ${sizeClass} ${className}`}></div>
        </div>
    );
};

export default Loader;
