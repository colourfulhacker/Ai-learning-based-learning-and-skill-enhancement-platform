'use client';

import React from 'react';
import LoadingSpinner from './components/LoadingSpinner';

export default function Loading() {
  return (
    <LoadingSpinner 
      size="large" 
      fullScreen 
      message="Loading your learning experience..."
    />
  );
}
