import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResumeBuilderForm from '../src/Components/Pages/ResumeBuilderForm/ResumeBuilderForm';

jest.mock('../src/Components/Sidebar/Sidebar', () => () => <div />);

test('shows Personal Info step', () => {
  render(<ResumeBuilderForm />);
  expect(screen.getByText(/Personal Information/i)).toBeInTheDocument();
});
