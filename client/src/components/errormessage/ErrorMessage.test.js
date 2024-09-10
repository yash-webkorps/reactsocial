import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  it('should render error message passed as prop', () => {
    const message = 'An error occurred!';

    render(<ErrorMessage message={message} />);

    // Check if the error message is rendered correctly
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should render with correct CSS class', () => {
    const message = 'Another error occurred!';

    render(<ErrorMessage message={message} />);

    // Check if the CSS class is applied correctly
    const errorMessageElement = screen.getByText(message);
    expect(errorMessageElement).toHaveClass('error-message');
  });
});
