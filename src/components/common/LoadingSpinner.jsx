import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  className = '', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`}
      ></div>
      {text && (
        <p className={`mt-3 text-muted ${textSizes[size]}`}>{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;