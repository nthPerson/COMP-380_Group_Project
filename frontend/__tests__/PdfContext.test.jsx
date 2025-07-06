import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PdfProvider } from '../src/Components/PdfContext';

test('PdfProvider renders children', () => {
  render(
    <PdfProvider>
      <div data-testid="child" />
    </PdfProvider>
  );
  expect(screen.getByTestId('child')).toBeInTheDocument();
});
