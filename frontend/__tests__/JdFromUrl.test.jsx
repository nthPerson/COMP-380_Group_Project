import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JdFromUrl from '../src/Components/Helpers/JdForm/JdFromUrl';

jest.mock('../../../src/Components/PdfContext', () => ({ usePdf: () => ({ masterDocID: '1' }) }));
jest.mock('../../../src/services/jobDescriptionService', () => ({ explainJdUrl: jest.fn().mockResolvedValue({ explanation: '', job_description: '' }) }));

test('renders URL input', () => {
  render(<JdFromUrl user={{ getIdToken: jest.fn() }} onExplanationReceived={jest.fn()} />);
  expect(screen.getByPlaceholderText(/https:\/\/…/i)).toBeInTheDocument();
});
