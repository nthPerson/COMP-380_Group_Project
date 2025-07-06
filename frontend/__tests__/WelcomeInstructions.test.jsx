import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomeInstructions from '../src/Components/Pages/WelcomeInstructions/WelcomeInstructions';

jest.mock('../src/Components/Sidebar/Sidebar', () => () => <div />);
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (_, cb) => {
    cb({ displayName: 'User' });
    return jest.fn();
  }
}));

test('shows getting started heading', () => {
  render(<WelcomeInstructions />);
  expect(screen.getByText(/Getting Started with RezuMe/i)).toBeInTheDocument();
});
