import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthenticationFailed from './AuthenticationFailed';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('AuthenticationFailed Component', () => {
  it('should render the AuthenticationFailed page with the correct message and button', () => {
    render(
      <Router>
        <AuthenticationFailed />
      </Router>
    );

    // Check if the message is in the document
    expect(screen.getByText('Please log in to continue')).toBeInTheDocument();

    // Check if the button is in the document
    expect(screen.getByText('Go to Login')).toBeInTheDocument();
  });

  it('should change button color on hover', () => {
    render(
      <Router>
        <AuthenticationFailed />
      </Router>
    );

    const button = screen.getByText('Go to Login');

    // Simulate mouse over
    fireEvent.mouseOver(button);

    // Check if the button's background color changes
    expect(button).toHaveStyle('background-color: #0056b3');

    // Simulate mouse out
    fireEvent.mouseOut(button);

    // Check if the button's background color changes back
    expect(button).toHaveStyle('background-color: #007bff');
  });

  it('should navigate to the login page when the button is clicked', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    render(
      <Router>
        <AuthenticationFailed />
      </Router>
    );

    const button = screen.getByText('Go to Login');
    fireEvent.click(button);

    // Check if the navigate function was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
