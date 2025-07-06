import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JdFromText from '../src/Components/Helpers/JdForm/JdFromText';

jest.mock('../../../src/Components/PdfContext', () => ({ usePdf: () => ({ masterDocID: '1' }) }));
jest.mock('../../../src/services/jobDescriptionService', () => ({ explainJdText: jest.fn().mockResolvedValue({ explanation: '', job_description: '' }) }));

test('renders JD text area', () => {
  render(<JdFromText user={{ getIdToken: jest.fn() }} onExplanationReceived={jest.fn()} />);
  expect(screen.getByPlaceholderText(/Enter job description/i)).toBeInTheDocument();
});
