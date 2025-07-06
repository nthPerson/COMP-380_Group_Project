import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenerateAndEditResume from '../src/Components/Pages/GenerateAndEditResume/GenerateAndEditResume';

jest.mock('../src/Components/Sidebar/Sidebar', () => () => <div />);
jest.mock('../src/Components/PdfContext', () => ({
  usePdf: () => ({ masterDocID: '1', fetchPdfsAndMaster: jest.fn() })
}));
jest.mock('../src/Components/TargetedResumeContext', () => ({
  useTargetedResume: () => ({ jdContent: '', generatedHtml: '', setGeneratedHtml: jest.fn() })
}));

test('renders Generate & Edit Resume header', () => {
  render(<GenerateAndEditResume />);
  expect(screen.getByText(/Generate & Edit Resume/i)).toBeInTheDocument();
});
