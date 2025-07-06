import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../src/Components/Helpers/Header/Header';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (_, cb) => {
    cb(null);
    return jest.fn();
  }
}));
jest.mock('../src/services/profileService', () => ({ getProfile: jest.fn() }));

test('renders nothing when user not logged in', () => {
  const { container } = render(<Header />);
  expect(container).toBeEmptyDOMElement();
});
