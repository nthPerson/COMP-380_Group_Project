import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationButton from '../src/Components/UI/NavigationButton/NavigationButton';
import { MemoryRouter } from 'react-router-dom';

test('renders link with correct href', () => {
  render(
    <MemoryRouter>
      <NavigationButton to="/test">Go</NavigationButton>
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: /Go/i })).toHaveAttribute('href', '/test');
});
