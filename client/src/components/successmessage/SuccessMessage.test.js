import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SuccessMessage from './SuccessMessage';

describe('SuccessMessage', () => {
  test('renders the success message correctly', () => {
    const message = 'Operation was successful!';
    render(<SuccessMessage message={message} />);

    // Check if the message is displayed
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('applies the correct CSS class', () => {
    const message = 'Operation was successful!';
    render(<SuccessMessage message={message} />);

    // Check if the message element has the correct CSS class
    expect(screen.getByText(message)).toHaveClass('success-message');
  });
});
