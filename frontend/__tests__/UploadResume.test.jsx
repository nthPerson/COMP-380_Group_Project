import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadResume from '../src/Components/Pages/UploadResume/UploadResume';

jest.mock('../src/Components/Sidebar/Sidebar', () => () => <div />);
jest.mock('../src/Components/Helpers/UploadPdf/UploadPdf', () => () => <div />);
jest.mock('../src/Components/Helpers/ResumeLibrary/ResumeLibrary', () => () => <div />);
jest.mock('../src/Components/PdfContext', () => ({ usePdf: () => ({ fetchPdfsAndMaster: jest.fn(), masterDocID: null }) }));

test('renders Upload Resume title', () => {
  render(<UploadResume />);
  expect(screen.getByText(/Upload Resume/i)).toBeInTheDocument();
});
