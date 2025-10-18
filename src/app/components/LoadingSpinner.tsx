'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  fullScreen = false,
  message 
}) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-solid border-current border-r-transparent text-purple-600 dark:text-purple-400`}></div>
      {message && (
        <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
