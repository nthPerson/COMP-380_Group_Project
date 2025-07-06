import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from '../src/Components/Pages/LandingPage/LandingPage';

test('renders How RezuMe Works section', () => {
  render(<LandingPage />);
  expect(screen.getByText(/How RezuMe Works/i)).toBeInTheDocument();
});
