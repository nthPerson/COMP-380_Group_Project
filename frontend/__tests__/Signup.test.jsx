import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginSignup from '../src/Components/Pages/Signup/Signup';

jest.mock('../src/services/authHandlers', () => ({
  handleSignup: jest.fn().mockResolvedValue({ email: 'a@test.com' })
}));

test('password visibility toggle works', async () => {
  render(<LoginSignup />);
  const password = screen.getByPlaceholderText(/Password/i);
  const toggle = screen.getByRole('button', { hidden: true });
  expect(password).toHaveAttribute('type', 'password');
  await userEvent.click(toggle);
  expect(password).toHaveAttribute('type', 'text');
});
