import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResumeDiffViewer } from '../src/Components/Helpers/StructuredDiffEditor/ResumeDiffViewer';

test('renders diff list items', () => {
  const ast = [{ type: 'paragraph', diff: [{ text: 'hello' }] }];
  render(<ResumeDiffViewer astWithDiff={ast} />);
  expect(screen.getByText('hello')).toBeInTheDocument();
});
