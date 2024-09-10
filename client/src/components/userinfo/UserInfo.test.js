import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import UserInfo from './UserInfo';

describe('UserInfo', () => {
  const defaultProps = {
    username: 'TestUser',
    profilePic: 'http://example.com/profile.jpg'
  };

  test('renders profile picture, username, and stats correctly', () => {
    render(
      <MemoryRouter>
        <UserInfo {...defaultProps} />
      </MemoryRouter>
    );

    // Check if the profile picture is rendered
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', defaultProps.profilePic);
    // Check if the username is rendered
    expect(screen.getByText(defaultProps.username)).toBeInTheDocument();
    // Check if stats are rendered
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('posts')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('followers')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('following')).toBeInTheDocument();
  });

  test('navigates to /editprofile when "Edit Profile" button is clicked', () => {
    const navigate = jest.fn();
    render(
      <MemoryRouter>
        <UserInfo {...defaultProps} />
      </MemoryRouter>
    );

    // Mock the useNavigate hook
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    // Click the "Edit Profile" button
    fireEvent.click(screen.getByText('Edit Profile'));

    // Check if navigate was called with the correct path
    expect(navigate).toHaveBeenCalledWith('/editprofile');
  });

  test('navigates back when "Back" button is clicked', () => {
    const navigate = jest.fn();
    render(
      <MemoryRouter>
        <UserInfo {...defaultProps} />
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
