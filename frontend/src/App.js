import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginOnly   from './Components/LoginOnly/LoginOnly';   
// import Homepage    from './Components/Homepage/Homepage';     
// import ForgotPassword    from './Components/ForgotPassword/ForgotPassword';  // Not currently being used
import LandingPage    from './Components/LandingPage/LandingPage';
import UserProfile    from './Components/UserProfile/UserProfile';
import TailorResume   from './Components/TailorResume/TailorResume';
import ResumeBuilderForm from './Components/ResumeBuilderForm'; // Added import for ResumeBuilderForm
import { PdfProvider } from './Components/PdfContext';
import WelcomeInstructions from './Components/WelcomeInstructions/WelcomeInstructions';

function App() {
  return (
    <PdfProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* 2) Sign-Up page (fields + “Login” button) */}
        <Route path="/signup" element={<LoginSignup />} />

        {/* 3) Separate login-only page (enter credentials here) */}
        <Route path="/login" element={<LoginOnly />} />

        {/* 4) Home (after they’ve successfully logged in) */}
        {/* <Route path="/home" element={<Homepage />} /> */}
        <Route path="/home" element={<TailorResume />} />

        {/* 5) Landing Page */}
        <Route path="/landingPage" element={<LandingPage />} />

        {/* 5) Welcome & Instructions */}
        <Route path='/welcome' element={<WelcomeInstructions />} />

        {/* 6) User Profile */}
        <Route path="/userProfile" element={<UserProfile />} />

        {/* 7) Tailor Resume */}
        <Route path="/tailorResume" element={<TailorResume />} />

        {/* 9) Create Resume */}
        <Route path="/createResume" element={<ResumeBuilderForm />} />


        {/* 8) Anything else → redirect to “/signup” */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </PdfProvider>

  );
}

export default App;
