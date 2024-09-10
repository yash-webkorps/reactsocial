import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from './Signup';
import '@testing-library/jest-dom';

// Mock the API and other modules
jest.mock('axios');
jest.mock('../../services/users/apis', () => ({
  signupApi: jest.fn(),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Test for rendering the signup form
  it('should render the signup form', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  // 2. Test for showing password validation errors
  it('should show password validation errors', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } });

    expect(screen.getByText(/Password must include/i)).toBeInTheDocument();
  });

  // 3. Test for allowing form submission when all fields are valid
  it('should allow form submission when all fields are valid', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1!' } });

    const submitButton = screen.getByText('Register');
    expect(submitButton).not.toBeDisabled();
  });

  // 4. Test for handling successful API call and redirect to login
  it('should handle successful form submission and redirect to login', async () => {
    // const mockNavigate = jest.fn();
    const mockSignupApi = require('../../services/users/apis').signupApi;
    mockSignupApi.mockResolvedValue({});

    render(
      <Router>
        <Signup />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1!' } });

    fireEvent.submit(screen.getByText('Register'));

    expect(mockSignupApi).toHaveBeenCalled();
    
    // Use `findByText` to wait for the redirect to login
    expect(await screen.findByText('Login')).toBeInTheDocument();
  });

  // 5. Test for displaying error message when API fails
  it('should display error message when API fails', async () => {
    const mockSignupApi = require('../../services/users/apis').signupApi;
    mockSignupApi.mockRejectedValue({ response: { status: 409 } });

    render(
      <Router>
        <Signup />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1!' } });

    fireEvent.submit(screen.getByText('Register'));

    // Use `findByText` to wait for the error message
    expect(await screen.findByText('User already Exist.')).toBeInTheDocument();
  });

  // 6. Test for showing and hiding the ProfilePicturePopup
  it('should show and hide the ProfilePicturePopup', async () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    fireEvent.submit(screen.getByText('Register'));

    // Use `findByText` to wait for the popup to appear
    expect(await screen.findByText(/upload your profile picture/i)).toBeInTheDocument();

    const closeButton = screen.getByText(/close/i);
    fireEvent.click(closeButton);

    // Use `queryByText` to verify the popup is removed
    expect(screen.queryByText(/upload your profile picture/i)).not.toBeInTheDocument();
  });

  // 7. Test for displaying loader during API call
  it('should display loader during API call', async () => {
    const mockSignupApi = require('../../services/users/apis').signupApi;
    mockSignupApi.mockResolvedValue({});

    render(
      <Router>
        <Signup />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Password1!' } });

    fireEvent.submit(screen.getByText('Register'));

    // Use `findByText` to wait for the loader
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
});
