import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileExtractor from '../src/Components/Helpers/ProfileExtractor/ProfileExtractor';

jest.mock('../../../src/services/resumeService', () => ({
  extractResumeProfileLLM: jest.fn().mockResolvedValue({ skills: [], education: [], experience: [] })
}));
jest.mock('../../../src/services/jobDescriptionService', () => ({
  extractJdProfile: jest.fn().mockResolvedValue({ required_skills: [], required_education: [], required_experience: [], responsibilities: [] })
}));
jest.mock('../../../src/services/keywordService', () => ({
  getSelectedKeywords: jest.fn().mockResolvedValue([]),
  addSelectedKeywords: jest.fn(),
  removeSelectedKeyword: jest.fn(),
  fetchHighlights: jest.fn().mockResolvedValue({ matched_resume: [], matched_jd: [] })
}));

test('renders loading text initially', () => {
  render(<ProfileExtractor masterDocID="1" jdText="test" />);
  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
});
