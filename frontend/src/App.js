// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginOnly   from './Components/LoginOnly/LoginOnly';   
import Homepage    from './Components/Homepage/Homepage';     
import ForgotPassword    from './Components/ForgotPassword/ForgotPassword';
import LandingPage    from './Components/LandingPage/LandingPage';
import { PdfProvider } from './Components/PdfContext';

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
        <Route path="/home" element={<Homepage />} />

        {/* 5) Anything else → redirect to “/signup” */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </PdfProvider>

  );
}

export default App;
