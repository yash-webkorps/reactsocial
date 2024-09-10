import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ProfilePicturePopup from './ProfilePicturePopup';
import '@testing-library/jest-dom/extend-expect';

describe('ProfilePicturePopup', () => {
  afterEach(cleanup);

  test('renders correctly', () => {
    render(<ProfilePicturePopup onClose={jest.fn()} onSubmit={jest.fn()} />);
    expect(screen.getByText(/Please upload Profile Picture/i)).toBeInTheDocument();
    expect(screen.getByText(/×/i)).toBeInTheDocument();
  });

  test('shows preview when a file is selected', () => {
    render(<ProfilePicturePopup onClose={jest.fn()} onSubmit={jest.fn()} />);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/file/i);

    // Mock URL.createObjectURL
    const createObjectURL = jest.fn(() => 'http://localhost:3000/example.png');
    global.URL.createObjectURL = createObjectURL;

    fireEvent.change(input, { target: { files: [file] } });
    
    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByRole('button', { name: /👁️‍🗨️/i })).toBeInTheDocument(); // Toggle button should be visible
  });

  test('toggles preview visibility', () => {
    render(<ProfilePicturePopup onClose={jest.fn()} onSubmit={jest.fn()} />);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/file/i);
    
    // Mock URL.createObjectURL
    const createObjectURL = jest.fn(() => 'http://localhost:3000/example.png');
    global.URL.createObjectURL = createObjectURL;

    fireEvent.change(input, { target: { files: [file] } });
    const toggleButton = screen.getByRole('button', { name: /👁️‍🗨️/i });
    
    fireEvent.click(toggleButton);
    expect(screen.queryByAltText(/Profile Preview/i)).not.toBeInTheDocument(); // Should hide preview

    fireEvent.click(toggleButton);
    expect(screen.getByAltText(/Profile Preview/i)).toBeInTheDocument(); // Should show preview
  });

  test('calls onSubmit with the selected file', () => {
    const mockOnSubmit = jest.fn();
    render(<ProfilePicturePopup onClose={jest.fn()} onSubmit={mockOnSubmit} />);
    
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/file/i);
    
    // Mock URL.createObjectURL
    const createObjectURL = jest.fn(() => 'http://localhost:3000/example.png');
    global.URL.createObjectURL = createObjectURL;

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/Submit/i));

    expect(mockOnSubmit).toHaveBeenCalledWith(file);
  });

  test('revokes object URL on unmount', () => {
    const revokeObjectURL = jest.fn();
    global.URL.revokeObjectURL = revokeObjectURL;
    
    const { unmount } = render(<ProfilePicturePopup onClose={jest.fn()} onSubmit={jest.fn()} />);
    
    // Mock URL.createObjectURL
    const createObjectURL = jest.fn(() => 'http://localhost:3000/example.png');
    global.URL.createObjectURL = createObjectURL;

    // Trigger file selection
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/file/i);
    fireEvent.change(input, { target: { files: [file] } });
    
    unmount();
    
    expect(revokeObjectURL).toHaveBeenCalled();
  });
});
