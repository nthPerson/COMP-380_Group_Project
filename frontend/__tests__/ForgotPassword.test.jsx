import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPassword from '../src/Components/Helpers/ForgotPassword/ForgotPassword';

test('placeholder component renders without crashing', () => {
  render(<ForgotPassword />);
});
