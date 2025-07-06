import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScrollToTop from '../src/Components/Helpers/ScrollToTop/ScrollToTop';
import { MemoryRouter } from 'react-router-dom';

test('renders nothing', () => {
  const { container } = render(
    <MemoryRouter>
      <ScrollToTop />
    </MemoryRouter>
  );
  expect(container).toBeEmptyDOMElement();
});
