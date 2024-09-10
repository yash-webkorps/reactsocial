import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Wrap with Router for navigation
import NavBar from './NavBar';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher

describe('NavBar Component', () => {
  const profilePic = 'profile-pic.png';

  // Helper to render NavBar with Router
  const renderNavBar = () => {
    render(
      <Router>
        <NavBar profilePic={profilePic} />
      </Router>
    );
  };

  it('should render the NavBar with all elements', () => {
    renderNavBar();

    // Check if logo and title are rendered
    expect(screen.getByAltText(/Instagram Logo/i)).toBeInTheDocument();
    expect(screen.getByText(/React Social./i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
    
    // Check if icons are rendered
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    expect(screen.getByTestId('explore-icon')).toBeInTheDocument();
    expect(screen.getByTestId('favorite-icon')).toBeInTheDocument();
    
    // Check if profile picture is rendered
    expect(screen.getByAltText(/Profile/i)).toBeInTheDocument();
  });

  it('should navigate to correct routes on icon click', () => {
    renderNavBar();

    // Click Home icon
    fireEvent.click(screen.getByTestId('home-icon'));
    // Since we are using Router, you should check if the location has changed
    expect(window.location.pathname).toBe('/home');

    // Click Create Post icon
    fireEvent.click(screen.getByTestId('add-icon'));
    expect(window.location.pathname).toBe('/createpost');

    // Click Profile picture
    fireEvent.click(screen.getByAltText(/Profile/i));
    expect(window.location.pathname).toBe('/userposts');
  });
});
