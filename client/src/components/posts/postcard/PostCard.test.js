import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import PostCard from './PostCard'; // Adjust the import path as necessary
import { modifyLikeCountApi } from '../../../services/posts/apis';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../../services/posts/apis', () => ({
  modifyLikeCountApi: jest.fn(),
  storeCommentApi: jest.fn(),
  deletePostApi: jest.fn(),
}));

jest.mock('../../../utils/jwtUtils', () => ({
  parseJwt: jest.fn(),
}));

const mockUpdateNewPost = jest.fn();
const mockRemovePostFromUi = jest.fn();

const defaultProps = {
  id: '1',
  title: 'Test Title',
  description: 'Test Description',
  content: 'test.jpg',
  likeCounts: 10,
  comments: [],
  userName: 'TestUser',
  isLikedProp: false,
  updateNewPost: mockUpdateNewPost,
  removePostFromUi: mockRemovePostFromUi,
  userId: 'user1',
  isAdmin: false,
};

const setup = (props = defaultProps) => {
  return render(
    <Router>
      <PostCard {...props} />
    </Router>
  );
};

it('should handle like button click', async () => {
    modifyLikeCountApi.mockResolvedValue({});
  
    setup();
  
    // Trigger the like button click
    fireEvent.click(screen.getByRole('button', { name: /Favorite Border Icon/i }));
  
    // Separate `waitFor` calls for each assertion
    await waitFor(() => {
      expect(modifyLikeCountApi).toHaveBeenCalledWith('Test Title', false);
    });
  
    await waitFor(() => {
      expect(screen.getByText(/11/i)).toBeInTheDocument();
    });
  });
  

it('should toggle comments visibility on click', () => {
  setup();

  fireEvent.click(screen.getByRole('button', { name: /Mode Comment Icon/i }));

  expect(screen.getByRole('form')).toBeInTheDocument();
});

it('should add a comment and display it', async () => {
    // Assume setup and rendering code here
  
    // Trigger the comment submission
    fireEvent.change(screen.getByPlaceholderText(/Add a comment.../i), { target: { value: 'New Comment' } });
    fireEvent.click(screen.getByText(/Submit/i));
  
    // Separate `waitFor` calls for each assertion
    await waitFor(() => {
      expect(screen.getByText(/TestUser: New Comment/i)).toBeInTheDocument();
    });
  
    await waitFor(() => {
      expect(screen.getByText(/Another Assertion/i)).toBeInTheDocument();
    });
  });
  

it('should open and close the share menu', () => {
  setup();

  fireEvent.click(screen.getByRole('button', { name: /Send Icon/i }));

  expect(screen.getByText(/WhatsApp/i)).toBeInTheDocument();
  
  fireEvent.click(screen.getByText(/Copy Link/i));
  
  expect(screen.queryByText(/WhatsApp/i)).not.toBeInTheDocument();
});

it('should open and close the edit popup', () => {
  setup();

  fireEvent.mouseEnter(screen.getByRole('button', { name: /More Vert Icon/i }));

  fireEvent.click(screen.getByText(/Edit/i));

  expect(screen.getByText(/Edit Post/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Close/i));

  expect(screen.queryByText(/Edit Post/i)).not.toBeInTheDocument();
});

it('should call removePostFromUi with the correct id on delete confirmation', async () => {
    // Assume setup and rendering code here
  
    fireEvent.click(screen.getByText(/Delete/i)); // Trigger the delete action
  
    // Check if the mock function was called with the correct argument
    expect(mockRemovePostFromUi).toHaveBeenCalledWith('1');
  });
  

it('should cancel delete operation', () => {
  setup();

  fireEvent.mouseEnter(screen.getByRole('button', { name: /More Vert Icon/i }));

  fireEvent.click(screen.getByText(/Delete/i));

  fireEvent.click(screen.getByText(/No/i));

  expect(screen.queryByText(/Are you sure you want to delete this post?/i)).not.toBeInTheDocument();
});

it('should navigate to post details on "Show More" click', () => {
  const navigate = jest.fn();
  useNavigate.mockReturnValue(navigate);

  setup();

  fireEvent.mouseEnter(screen.getByRole('button', { name: /More Vert Icon/i }));

  fireEvent.click(screen.getByText(/Show More../i));

  expect(navigate).toHaveBeenCalledWith('/home/userposts/1');
});
