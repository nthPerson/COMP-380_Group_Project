import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResumeArchive from '../src/Components/Pages/ResumeArchive/ResumeArchive';

jest.mock('../src/Components/Sidebar/Sidebar', () => () => <div>Sidebar</div>);
jest.mock('../src/Components/Helpers/ResumeLibrary/ResumeViewerModal', () => () => <div />);
jest.mock('../src/Components/PdfContext', () => ({
  usePdf: () => ({ pdfs: [], handleDelete: jest.fn() })
}));

test('renders archive header', () => {
  render(<ResumeArchive />);
  expect(screen.getByText(/RezuMe Archive/i)).toBeInTheDocument();
});
