import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UploadFileBox from '../src/Components/UI/UploadFileBox/UploadFileBox';

test('triggers onUpload when Upload clicked', async () => {
  const onUpload = jest.fn();
  render(<UploadFileBox onUpload={onUpload} accept="application/pdf" />);
  const input = screen.getByRole('textbox', { hidden: true });
  const file = new File(['x'], 'test.pdf', { type: 'application/pdf' });
  await userEvent.upload(input, file);
  await userEvent.click(screen.getByText(/Upload/i));
  expect(onUpload).toHaveBeenCalled();
});
