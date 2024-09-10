import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EditProfile from './EditProfile';
import { updateProfileApi } from '../../services/posts/apis';
import { AxiosError } from 'axios';

// Mock the updateProfileApi function
jest.mock('../../services/posts/apis', () => ({
  updateProfileApi: jest.fn(),
}));

// Mock the ErrorMessage and Loader components
jest.mock('../errormessage/ErrorMessage', () => (props) => <div>{props.message}</div>);
jest.mock('../loader/Loader', () => () => <div>Loading...</div>);

describe('EditProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the EditProfile page with all fields', () => {
    render(
      <Router>
        <EditProfile />
      </Router>
    );

    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Update Profile Picture:')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile Visibility:')).toBeInTheDocument();
  });

  it('should show file preview on file selection', () => {
    render(
      <Router>
        <EditProfile />
      </Router>
    );

    const fileInput = screen.getByLabelText('Update Profile Picture:');
    const file = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check if the preview URL is created and the preview is visible
    expect(screen.getByAltText('Profile Preview')).toBeInTheDocument();
  });

  it('should show and hide the file preview', () => {
    render(
      <Router>
        <EditProfile />
      </Router>
    );

    const fileInput = screen.getByLabelText('Update Profile Picture:');
    const file = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    const toggleButton = screen.getByText('👁️‍🗨️');
    fireEvent.click(toggleButton);

    // Check if the preview is hidden
    expect(screen.queryByAltText('Profile Preview')).not.toBeVisible();
  });

  it('should display password validation error message', async () => {
    render(
      <Router>
        <EditProfile />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'short' } });

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Password must include/i)).toBeInTheDocument();
    });
  });

  it('should handle form submission with valid data', async () => {
    const mockUpdateProfileApi = updateProfileApi;
    mockUpdateProfileApi.mockResolvedValue({});

    render(
      <Router>
        <EditProfile />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password1!' } });

    const fileInput = screen.getByLabelText('Update Profile Picture:');
    const file = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit'));

    // Check if the API call was made
    await waitFor(() => {
      expect(mockUpdateProfileApi).toHaveBeenCalled();
    });

    // Check if the API call was made with FormData
    await waitFor(() => {
      expect(mockUpdateProfileApi).toHaveBeenCalledWith(expect.any(FormData));
    });
  });

  it('should handle form submission error', async () => {
    const mockUpdateProfileApi = updateProfileApi;
    mockUpdateProfileApi.mockRejectedValue(new AxiosError('Request failed', null, null, null, { status: 500 }));

    render(
      <Router>
        <EditProfile />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password1!' } });

    const fileInput = screen.getByLabelText('Update Profile Picture:');
    const file = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit'));

    // Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Something went wrong on the server.')).toBeInTheDocument();
    });
  });

  it('should show loader during API call', async () => {
    const mockUpdateProfileApi = updateProfileApi;
    mockUpdateProfileApi.mockResolvedValue({});

    render(
      <Router>
        <EditProfile />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Password1!' } });

    const fileInput = screen.getByLabelText('Update Profile Picture:');
    const file = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit'));

    // Check if the loader is displayed
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
