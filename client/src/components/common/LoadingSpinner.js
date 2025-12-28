import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClass = size === 'sm' ? 'spinner--sm' : size === 'lg' ? 'spinner--lg' : '';
  
  return (
    <div className={`spinner ${sizeClass} ${className}`}></div>
  );
};

export default LoadingSpinner;