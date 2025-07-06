import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WarningBox from '../src/Components/UI/WarningBox/WarningBox';

test('renders warning message', () => {
  render(<WarningBox>Be careful!</WarningBox>);
  expect(screen.getByText(/Be careful!/i)).toBeInTheDocument();
});
