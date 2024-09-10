import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from './Home';
import { fetchPostsApi, sortPostsApi } from '../../services/posts/apis';
import { useNavigate } from 'react-router-dom';

// Mock the necessary modules and hooks
jest.mock('../../services/posts/apis', () => ({
  fetchPostsApi: jest.fn(),
  sortPostsApi: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Home Component', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    (useNavigate).mockReturnValue(navigate);
  });

  it('should render posts and error message', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', description: 'Description 1', content: 'Content 1', likeCounts: 5, comments: [], user: { username: 'User 1' }, isLiked: false, userId: 'user1', createdAt: new Date().toISOString() }
    ];
    const mockUser = { username: 'User', email: 'user@example.com', profilePic: 'profile.png', isAdmin: false };
    
    (fetchPostsApi).mockResolvedValue({ posts: mockPosts, user: mockUser });
    (sortPostsApi).mockResolvedValue(mockPosts);

    render(<Home />);

    // Wait for posts to be rendered
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    // Check for the presence of error message (none should be present initially)
    expect(screen.queryByText(/Error Sorting Posts/i)).not.toBeInTheDocument();
  });

  it('should handle sorting posts', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', description: 'Description 1', content: 'Content 1', likeCounts: 5, comments: [], user: { username: 'User 1' }, isLiked: false, userId: 'user1', createdAt: new Date().toISOString() }
    ];
    
    (sortPostsApi).mockResolvedValue(mockPosts);

    render(<Home />);

    // Change sorting option
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'mostLiked' } });

    // Ensure sorting function was called
    await waitFor(() => {
      expect(sortPostsApi).toHaveBeenCalledWith(mockPosts, 'mostLiked');
    });
  });

  it('should handle infinite scrolling', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', description: 'Description 1', content: 'Content 1', likeCounts: 5, comments: [], user: { username: 'User 1' }, isLiked: false, userId: 'user1', createdAt: new Date().toISOString() }
    ];
    const mockUser = { username: 'User', email: 'user@example.com', profilePic: 'profile.png', isAdmin: false };

    (fetchPostsApi).mockResolvedValue({ posts: mockPosts, user: mockUser });

    render(<Home />);

    // Simulate scrolling to the bottom
    act(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    // Wait for new posts to be fetched
    await waitFor(() => {
      expect(fetchPostsApi).toHaveBeenCalledWith(2, 3); // Check that next page was fetched
    });
  });

  it('should navigate to authentication failed page on error', async () => {
    (fetchPostsApi).mockRejectedValue(new Error('Failed to fetch'));

    render(<Home />);

    // Wait for navigation
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/authenticationfailed');
    });
  });

  it('should render error message if sorting fails', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', description: 'Description 1', content: 'Content 1', likeCounts: 5, comments: [], user: { username: 'User 1' }, isLiked: false, userId: 'user1', createdAt: new Date().toISOString() }
    ];
    const mockUser = { username: 'User', email: 'user@example.com', profilePic: 'profile.png', isAdmin: false };

    (fetchPostsApi).mockResolvedValue({ posts: mockPosts, user: mockUser });
    (sortPostsApi).mockRejectedValue(new Error('Sorting failed'));

    render(<Home />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Error Sorting Posts')).toBeInTheDocument();
    });
  });
});
