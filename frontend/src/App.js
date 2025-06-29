import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginOnly   from './Components/LoginOnly/LoginOnly';   
// import Homepage    from './Components/Homepage/Homepage';     
// import ForgotPassword    from './Components/ForgotPassword/ForgotPassword';  // Not currently being used
import LandingPage    from './Components/LandingPage/LandingPage';
import UserProfile    from './Components/UserProfile/UserProfile';
// import TailorResume   from './Components/TailorResume/TailorResume';  // Being deprecated in favor of Resume Workflow Pages
import ResumeBuilderForm from './Components/ResumeBuilderForm/ResumeBuilderForm'; // Added import for ResumeBuilderForm
import { PdfProvider } from './Components/PdfContext';
import WelcomeInstructions from './Components/WelcomeInstructions/WelcomeInstructions';
import UploadResume from './Components/UploadResume/UploadResume';
import AddJd from './Components/AddJd/AddJd';
import SelectKeywords from './Components/SelectKeywords/SelectKeywords';
import GenerateAndEditResume from './Components/GenerateAndEditResume/GenerateAndEditResume';
import ResumeArchive from './Components/ResumeArchive/ResumeArchive';
import { TargetedResumeProvider } from './Components/TargetedResumeContext';


function App() {
  return (
    <PdfProvider>
    <TargetedResumeProvider>
        <Routes>
            {/* App root: Landing page */}
            <Route path="/" element={<LandingPage />} />

            {/* Sign-Up page (fields + “Login” button) */}
            <Route path="/signup" element={<LoginSignup />} />

            {/* Separate login-only page (enter credentials here) */}
            <Route path="/login" element={<LoginOnly />} />

            {/* Home (after they’ve successfully logged in) */}
            {/* <Route path="/home" element={<Homepage />} /> */}
            {/* <Route path="/home" element={<TailorResume />} /> */}
            <Route path='/home' element={<UploadResume />} />

            {/* Landing Page */}
            <Route path="/landingPage" element={<LandingPage />} />

            {/* Welcome & Instructions */}
            <Route path='/welcome' element={<WelcomeInstructions />} />

            {/* User Profile */}
            <Route path="/userProfile" element={<UserProfile />} />

            {/* Tailor Resume Workflow Pages */}
            {/* <Route path="/tailorResume" element={<TailorResume />} /> */}
            <Route path="/uploadResume" element={<UploadResume />} />
            <Route path="/addJobDescription" element={<AddJd />} />
            <Route path="/selectKeywords" element={<SelectKeywords />} />
            <Route path="/generateEditResume" element={<GenerateAndEditResume />} />
            <Route path="/resumeArchive" element={<ResumeArchive />} />

            {/* Create Resume */}
            <Route path="/createResume" element={<ResumeBuilderForm />} />

            {/* Anything else → redirect to “/signup” */}
            <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
    </TargetedResumeProvider>
    </PdfProvider>

  );
}

export default App;
