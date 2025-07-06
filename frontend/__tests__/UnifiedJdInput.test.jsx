import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedJdInput from '../src/Components/Helpers/JdForm/UnifiedJdInput';

jest.mock('../../../src/Components/PdfContext', () => ({ usePdf: () => ({ masterDocID: '1' }) }));
jest.mock('../../../src/services/jobDescriptionService', () => ({
  explainJdUrl: jest.fn().mockResolvedValue({ explanation: '', job_description: '' }),
  explainJdText: jest.fn().mockResolvedValue({ explanation: '', job_description: '' })
}));

test('renders textarea for job description', () => {
  render(<UnifiedJdInput user={{ getIdToken: jest.fn() }} onExplanationReceived={jest.fn()} />);
  expect(screen.getByPlaceholderText(/Paste a job description/i)).toBeInTheDocument();
});
