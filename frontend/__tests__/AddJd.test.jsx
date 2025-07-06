import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddJd from '../src/Components/Pages/AddJd/AddJd';

jest.mock('../src/Components/Sidebar/Sidebar', () => () => <div />);
jest.mock('../src/Components/Helpers/JdForm/UnifiedJdInput', () => () => <div />);
jest.mock('../src/Components/PdfContext', () => ({ usePdf: () => ({ masterDocID: '1' }) }));
jest.mock('../src/Components/TargetedResumeContext', () => ({
  useTargetedResume: () => ({ setJdExplanation: jest.fn(), setJdContent: jest.fn(), jdContent: '' })
}));

test('renders Add Job Description header', () => {
  render(<AddJd />);
  expect(screen.getByText(/Add Job Description/i)).toBeInTheDocument();
});
