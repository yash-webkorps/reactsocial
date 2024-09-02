// src/pages/AuthenticationPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthenticationFailed: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Adjust the path as needed
  };

  const pageStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  };

  const messageStyles: React.CSSProperties = {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  };

  const buttonStyles: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyles: React.CSSProperties = {
    backgroundColor: '#0056b3'
  };

  return (
    <div style={pageStyles}>
      <div style={messageStyles}>
        Please log in to continue
      </div>
      <button
        style={buttonStyles}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyles.backgroundColor!)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyles.backgroundColor!)}
        onClick={handleLoginClick}
      >
        Go to Login
      </button>
    </div>
  );
};

export default AuthenticationFailed;
