import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectKeywords from '../src/Components/Helpers/SelectKeywords/SelectKeywords';

jest.mock('../src/Components/Sidebar/Sidebar', () => () => <div />);
jest.mock('../src/Components/PdfContext', () => ({ usePdf: () => ({ masterDocID: '1' }) }));
jest.mock('../src/Components/TargetedResumeContext', () => ({ useTargetedResume: () => ({ jdContent: 'x' }) }));

test('renders Select Keywords title', () => {
  render(<SelectKeywords />);
  expect(screen.getByText(/Select Keywords/i)).toBeInTheDocument();
});
