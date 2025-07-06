import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../src/App';

// Mock child pages so routing works without their implementations
jest.mock('../src/Components/Pages/Signup/Signup', () => () => <div>SignUp Page</div>);
jest.mock('../src/Components/Pages/WelcomeInstructions/WelcomeInstructions', () => () => <div>Welcome Page</div>);
jest.mock('../src/Components/Helpers/Header/Header', () => () => <div data-testid="header">HEADER</div>);

test('hides header on signup page', () => {
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.queryByTestId('header')).not.toBeInTheDocument();
});

test('shows header on welcome page', () => {
  render(
    <MemoryRouter initialEntries={['/welcome']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByTestId('header')).toBeInTheDocument();
});
