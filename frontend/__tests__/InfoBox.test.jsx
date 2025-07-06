import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoBox from '../src/Components/UI/InfoBox/InfoBox';

test('renders title and items', () => {
  render(<InfoBox title="Tips" items={["One", "Two"]} />);
  expect(screen.getByText(/Tips/)).toBeInTheDocument();
  expect(screen.getByText('One')).toBeInTheDocument();
});
