import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import StructuredResumeEditor from '../src/Components/Helpers/StructuredDiffEditor/StructuredResumeEditor';

test('placeholder component renders', () => {
  render(<StructuredResumeEditor />);
});
