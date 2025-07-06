import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TinyDiffEditor from '../src/Components/Helpers/TinyDiffEditor/TinyDiffEditor';

test('renders TinyDiffEditor', () => {
  render(<TinyDiffEditor value="<p>Hello</p>" onEditorChange={() => {}} />);
});
