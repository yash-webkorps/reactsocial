import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EditPost from './EditPost';
import { updatePostRequestApi } from '../../../services/posts/apis';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../../services/posts/apis', () => ({
  updatePostRequestApi: jest.fn(),
}));

const closeEditPopup = jest.fn();
const updatePost = jest.fn();

it('should handle form submission and call appropriate functions', async () => {
  // Mock API response
  updatePostRequestApi.mockResolvedValue({
    data: {
      updatedPost: {
        id: '1',
        title: 'Updated Title',
        description: 'Updated Description',
        userName: 'TestUser',
      },
    },
  });

  render(
    <Router>
      <EditPost
        id="1"
        title="Test Title"
        description="Test Description"
        closeEditPopup={closeEditPopup}
        updatePost={updatePost}
      />
    </Router>
  );

  // Update input values
  fireEvent.change(screen.getByLabelText(/Title:/i), {
    target: { value: 'Updated Title' },
  });
  fireEvent.change(screen.getByLabelText(/Description:/i), {
    target: { value: 'Updated Description' },
  });

  // Simulate file selection
  const file = new File(['test'], 'test.png', { type: 'image/png' });
  fireEvent.change(screen.getByLabelText(/Image:/i), {
    target: { files: [file] },
  });

  // Submit form
  fireEvent.click(screen.getByText(/Submit/i));

  // Check if updatePost function was called with the correct arguments
  await waitFor(() => {
    expect(updatePost).toHaveBeenCalledWith({
      id: '1',
      title: 'Updated Title',
      description: 'Updated Description',
      user: { username: 'TestUser' },
    });
  });

  // Check if closeEditPopup function was called
  await waitFor(() => {
    expect(closeEditPopup).toHaveBeenCalled();
  });
});
