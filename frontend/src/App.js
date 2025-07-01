import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from "./Components/Helpers/Header/Header";
import { PdfProvider } from './Components/PdfContext';
import { TargetedResumeProvider } from './Components/TargetedResumeContext';
import SelectKeywords from './Components/Helpers/SelectKeywords/SelectKeywords';

/* ===== Pages ===== */
import LandingPage    from './Components/Pages/LandingPage/LandingPage';
import LoginSignup from './Components/Pages/LoginSignup/LoginSignup';
import LoginOnly   from './Components/Pages/LoginOnly/LoginOnly';   
import UserProfile    from './Components/Pages/UserProfile/UserProfile';
import WelcomeInstructions from './Components/Pages/WelcomeInstructions/WelcomeInstructions';
import UploadResume from './Components/Pages/UploadResume/UploadResume';
import ResumeBuilderForm from './Components/Pages/ResumeBuilderForm/ResumeBuilderForm'; // Added import for ResumeBuilderForm
import AddJd from './Components/Pages/AddJd/AddJd';
import GenerateAndEditResume from './Components/Pages/GenerateAndEditResume/GenerateAndEditResume';
import ResumeArchive from './Components/Pages/ResumeArchive/ResumeArchive';







function App() {
  const { pathname } = useLocation();

  // Specify which paths should NOT show the avatar widget:
  const hideHeaderOn = ["/", "/login", "/signup", "/landingPage", "/userProfile"];
  return (
  <>
    {!hideHeaderOn.includes(pathname) && <Header />}

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
    </>
  );
}

export default App;
