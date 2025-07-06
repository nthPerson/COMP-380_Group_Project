import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginOnly from '../src/Components/Pages/LoginOnly/LoginOnly';

jest.mock('../src/services/authHandlers', () => ({
  handleLogin: jest.fn().mockResolvedValue({ email: 'test@test.com' }),
  handlePasswordReset: jest.fn().mockResolvedValue()
}));

test('allows entering email and password', async () => {
  render(<LoginOnly />);
  await userEvent.type(screen.getByPlaceholderText(/Email/i), 'user@test.com');
  await userEvent.type(screen.getByPlaceholderText(/Password/i), 'pass');
  expect(screen.getByPlaceholderText(/Email/i)).toHaveValue('user@test.com');
});
