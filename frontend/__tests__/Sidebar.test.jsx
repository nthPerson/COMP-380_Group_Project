import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Sidebar from '../src/Components/Sidebar/Sidebar';
import { MemoryRouter } from 'react-router-dom';

test('toggle button collapses sidebar', async () => {
  render(
    <MemoryRouter>
      <Sidebar user={{}} />
    </MemoryRouter>
  );
  const button = screen.getByTitle(/Collapse sidebar/i);
  await userEvent.click(button);
  expect(button).toBeInTheDocument();
});
