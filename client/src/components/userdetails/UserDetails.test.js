import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
  const defaultProps = {
    profilePic: 'http://example.com/profile.jpg',
    username: 'TestUser',
    email: 'testuser@example.com'
  };

  test('renders profile picture, username, and email correctly', () => {
    render(
      <MemoryRouter>
        <UserProfile {...defaultProps} />
      </MemoryRouter>
    );

    // Check if the profile picture is rendered
    expect(screen.getByAltText('Cover')).toHaveAttribute('src', defaultProps.profilePic);
    // Check if the username is rendered
    expect(screen.getByText(defaultProps.username)).toBeInTheDocument();
    // Check if the email is rendered
    expect(screen.getByText(defaultProps.email)).toBeInTheDocument();
  });

  test('shows "Account Info" button when not on /userposts page', () => {
    render(
      <MemoryRouter initialEntries={['/someotherpage']}>
        <UserProfile {...defaultProps} />
      </MemoryRouter>
    );

    // Check if "Account Info" button is rendered
    expect(screen.getByText('Account Info')).toBeInTheDocument();
  });

  test('shows "Back" button when on /userposts page', () => {
    render(
      <MemoryRouter initialEntries={['/userposts']}>
        <UserProfile {...defaultProps} />
      </MemoryRouter>
    );

    // Check if "Back" button is rendered
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('navigates to /userposts when "Account Info" button is clicked', () => {
    const navigate = jest.fn();
    render(
      <MemoryRouter initialEntries={['/someotherpage']}>
        <UserProfile {...defaultProps} />
        <Routes>
          <Route path="/userposts" element={<div>User Posts Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Mock the useNavigate hook
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    // Click the "Account Info" button
    fireEvent.click(screen.getByText('Account Info'));

    // Check if navigate was called with the correct path
    expect(navigate).toHaveBeenCalledWith('/userposts');
  });

  test('navigates back when "Back" button is clicked', () => {
    const navigate = jest.fn();
    render(
      <MemoryRouter initialEntries={['/userposts']}>
        <UserProfile {...defaultProps} />
        <Routes>
          <Route path="/userposts" element={<div>User Posts Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Mock the useNavigate hook
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    // Click the "Back" button
    fireEvent.click(screen.getByText('Back'));

    // Check if navigate was called with -1 to go back
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});
