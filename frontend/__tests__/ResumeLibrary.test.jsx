import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResumeLibrary from '../src/Components/Helpers/ResumeLibrary/ResumeLibrary';

jest.mock('../src/Components/PdfContext', () => ({
  usePdf: () => ({
    pdfs: [],
    masterDocID: null,
    loading: false,
    statusMessage: '',
    handleDelete: jest.fn(),
    handleSetMaster: jest.fn()
  })
}));
jest.mock('../src/Components/Helpers/ResumeLibrary/ResumeViewerModal', () => () => <div />);

test('shows message when no resumes', () => {
  render(<ResumeLibrary />);
  expect(screen.getByText(/No resumes uploaded yet/i)).toBeInTheDocument();
});
