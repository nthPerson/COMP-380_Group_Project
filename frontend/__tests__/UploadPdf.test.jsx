import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UploadPdf from '../src/Components/Helpers/UploadPdf/UploadPdf';

jest.mock('../src/Components/PdfContext', () => ({
  usePdf: () => ({ uploadPdf: jest.fn() })
}));

test('calls onUpload when file selected', async () => {
  render(<UploadPdf />);
  const input = screen.getByText(/Upload PDF/i).closest('input');
  const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
  await userEvent.upload(input, file);
});
