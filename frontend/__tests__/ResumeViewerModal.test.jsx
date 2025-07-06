import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResumeViewerModal from '../src/Components/Helpers/ResumeLibrary/ResumeViewerModal';

test('renders modal when open', () => {
  render(<ResumeViewerModal isOpen onClose={jest.fn()} pdfUrl="test.pdf" />);
  expect(screen.getByText(/Resume Preview/i)).toBeInTheDocument();
});
