import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TargetedResumeProvider, useTargetedResume } from '../src/Components/TargetedResumeContext';

function Consumer() {
  const { setJdContent } = useTargetedResume();
  setJdContent('test');
  return <div>child</div>;
}

test('TargetedResumeProvider provides context', () => {
  render(
    <TargetedResumeProvider>
      <Consumer />
    </TargetedResumeProvider>
  );
  expect(screen.getByText('child')).toBeInTheDocument();
});
