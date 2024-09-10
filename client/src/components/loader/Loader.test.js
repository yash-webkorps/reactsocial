import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher

describe('Loader Component', () => {
  it('should render the loader spinner and message', () => {
    // Render the Loader component
    render(<Loader />);

    // Check if the loader spinner is in the document
    const loaderSpinner = screen.getByRole('status'); // Assuming loader has role status for accessibility
    expect(loaderSpinner).toBeInTheDocument();

    // Check if the "Please wait..." message is in the document
    expect(screen.getByText(/Please wait.../i)).toBeInTheDocument();
  });

  it('should have correct class names for styling', () => {
    // Render the Loader component
    render(<Loader />);

    // Check if the overlay has the correct class
    const overlayElement = screen.getByTestId('loader-overlay');
    expect(overlayElement).toHaveClass('loader-overlay');

    // Check if the spinner has the correct class
    const spinnerElement = screen.getByTestId('loader-spinner');
    expect(spinnerElement).toHaveClass('loader');
  });
});
