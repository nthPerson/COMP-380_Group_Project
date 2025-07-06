import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '../src/Components/Pages/UserProfile/UserProfile';

jest.mock('../src/Components/Sidebar/Sidebar', () => () => <div />);
jest.mock('../src/services/profileService', () => ({
  getProfile: jest.fn().mockResolvedValue({})
}));
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (_, cb) => {
    cb(null);
    return jest.fn();
  }
}));

test('shows loading when no user', () => {
  render(<UserProfile />);
  expect(screen.getByText(/Loading user profile/i)).toBeInTheDocument();
});
