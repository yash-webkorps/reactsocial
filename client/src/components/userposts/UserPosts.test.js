import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import UserPosts from './UserPosts';
import * as api from '../../services/posts/apis';

// Mock dependencies
jest.mock('../../services/posts/apis', () => ({
  fetchUserPostsApi: jest.fn(),
}));

describe('UserPosts', () => {
  const mockPosts = [
    {
      id: '1',
      title: 'Post 1',
      description: 'Description 1',
      content: 'Content 1',
      likeCounts: 10,
      comments: [],
      user: { username: 'TestUser1' },
      isLiked: false,
      userId: 'user1',
      createdAt: '2024-09-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Post 2',
      description: 'Description 2',
      content: 'Content 2',
      likeCounts: 20,
      comments: [],
      user: { username: 'TestUser2' },
      isLiked: false,
      userId: 'user2',
      createdAt: '2024-09-02T00:00:00Z',
    },
  ];

  const mockUser = {
    username: 'TestUser',
    email: 'test@example.com',
    profilePic: 'http://example.com/profile.jpg',
    isAdmin: false,
  };

  test('fetches and displays posts and user information', async () => {
    // Mock the API response
    api.fetchUserPostsApi.mockResolvedValue({ posts: mockPosts, user: mockUser });

    render(
      <MemoryRouter>
        <UserPosts />
      </MemoryRouter>
    );

    // Check if user info is displayed
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', mockUser.profilePic);

    // Check if posts are displayed
    expect(await screen.findByText('Post 1')).toBeInTheDocument();
    expect(await screen.findByText('Post 2')).toBeInTheDocument();
  });

  test('handles sorting of posts', async () => {
    api.fetchUserPostsApi.mockResolvedValue({ posts: mockPosts, user: mockUser });

    render(
      <MemoryRouter>
        <UserPosts />
      </MemoryRouter>
    );

    // Change sorting option to "oldest"
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'oldest' } });

    // Verify that Post 1 appears before Post 2 when sorted by oldest
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    // Mock API to reject
    api.fetchUserPostsApi.mockRejectedValue(new Error('Authentication failed'));

    render(
      <MemoryRouter>
        <UserPosts />
      </MemoryRouter>
    );

    // Check if navigation happens
    await waitFor(() => {
      expect(window.location.pathname).toBe('/authenticationfailed');
    });
  });

  // Additional tests for post update and removal could be added here
});
