// src/components/Loader.tsx
import React from 'react';
import './Loader.css'; // Create a CSS file for loader styles

const Loader: React.FC = () => {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
      <p>Please wait...</p>
    </div>
  );
};

export default Loader;
