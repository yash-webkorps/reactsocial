import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher
import CreatePost from './CreatePost';
import { addPostApi } from '../../../services/posts/apis';
import Cookies from 'js-cookie';
import { BrowserRouter as Router } from 'react-router-dom';

// Mocking the addPostApi and Cookies
jest.mock('../../../services/posts/apis');
jest.mock('js-cookie');

describe('CreatePost Component', () => {
  beforeEach(() => {
    (addPostApi).mockResolvedValue({
      data: {
        post: { id: '1', title: 'Test Post' },
        userName: 'TestUser',
      },
    });
    (Cookies.get).mockReturnValue('mockToken');
  });

  it('should render the CreatePost form', () => {
    render(
      <Router>
        <CreatePost />
      </Router>
    );

    expect(screen.getByText(/Create Post/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Profile Visibility:/i)).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(
      <Router>
        <CreatePost />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Title:/i), {
      target: { value: 'Test Title' }
    });
    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: 'Test Description' }
    });

    expect(screen.getByLabelText(/Title:/i).value).toBe('Test Title');
    expect(screen.getByLabelText(/Description:/i).value).toBe('Test Description');
  });

  it('should handle file selection and preview', async () => {
    render(
      <Router>
        <CreatePost />
      </Router>
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Image:/i), {
      target: { files: [file] }
    });

    expect(screen.getByAltText(/Profile Preview/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/👁️‍🗨️/i));
    await waitFor(() => {
      expect(screen.getByAltText(/Profile Preview/i)).toBeVisible();
    });

    fireEvent.click(screen.getByText(/👁️/i));
    await waitFor(() => {
      expect(screen.queryByAltText(/Profile Preview/i)).not.toBeVisible();
    });
  });

  it('should handle form submission', async () => {
    render(
      <Router>
        <CreatePost />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Title:/i), {
      target: { value: 'Test Title' }
    });
    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: 'Test Description' }
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Image:/i), {
      target: { files: [file] }
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.queryByText(/Create Post/i)).not.toBeInTheDocument(); // Assuming navigation to /userposts
    });
  });

  it('should show error messages on form submission error', async () => {
    (addPostApi).mockRejectedValue({
      response: { status: 400 },
    });

    render(
      <Router>
        <CreatePost />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Title:/i), {
      target: { value: 'Test Title' }
    });
    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: 'Test Description' }
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Image:/i), {
      target: { files: [file] }
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/All fields are mandatory./i)).toBeInTheDocument();
    });
  });

  it('should show loading spinner when submitting', async () => {
    render(
      <Router>
        <CreatePost />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Title:/i), {
      target: { value: 'Test Title' }
    });
    fireEvent.change(screen.getByLabelText(/Description:/i), {
      target: { value: 'Test Description' }
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Image:/i), {
      target: { files: [file] }
    });

    fireEvent.click(screen.getByText(/Submit/i));

    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // Assuming Loader component uses progress bar
  });
});
