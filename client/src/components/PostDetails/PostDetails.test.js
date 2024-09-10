import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Wrap with Router for navigation
import PostDetails from './PostDetails';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher
import axios from 'axios';
import Cookies from 'js-cookie';

// Mocking axios and Cookies
jest.mock('axios');
jest.mock('js-cookie');

describe('PostDetails Component', () => {
  const mockPost = {
    id: '1',
    title: 'Test Post',
    description: 'This is a test post',
    content: 'Post content goes here',
    likeCounts: 10,
    comments: [],
    user: { username: 'TestUser' },
    isLiked: false,
    userId: '123',
  };

  const mockUser = {
    username: 'TestUser',
    email: 'testuser@example.com',
    profilePic: 'profile-pic.png',
    isAdmin: false,
  };

  beforeEach(() => {
    (Cookies.get).mockReturnValue('mockToken');
    (axios.get).mockResolvedValue({
      data: {
        post: mockPost,
        user: mockUser,
      },
    });
  });

  it('should render PostDetails and fetch post details', async () => {
    render(
      <Router>
        <Routes>
          <Route path="/postdetails/:id" element={<PostDetails />} />
        </Routes>
      </Router>
    );

    // Wait for the post details to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText(/Post Details :/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Go Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Post/i)).toBeInTheDocument();
  });

  it('should handle go back button click', () => {
    render(
      <Router>
        <Routes>
          <Route path="/postdetails/:id" element={<PostDetails />} />
        </Routes>
      </Router>
    );

    fireEvent.click(screen.getByText(/Go Back/i));
    expect(window.history.length).toBeGreaterThan(1); // Ensures navigation occurs
  });

  it('should navigate to authentication failed page on error', async () => {
    (axios.get).mockRejectedValue(new Error('Failed to fetch'));

    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    render(
      <Router>
        <Routes>
          <Route path="/postdetails/:id" element={<PostDetails />} />
        </Routes>
      </Router>
    );

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/authenticationfailed');
    });
  });
});
