// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginOnly   from './Components/LoginOnly/LoginOnly';   
import Homepage    from './Components/Homepage/Homepage';     
import ForgotPassword    from './Components/ForgotPassword/ForgotPassword';

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />

        {/* Path “/login” shows login form*/}
        <Route path="/login" element={<LoginOnly />} />

        {/* Path “/signup” shows LoginSignup */}
        <Route path="/signup" element={<LoginSignup />} />

        {/* Path “/forgotpassword” shows LoginSignup */}
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* After successful sign-up, navigate("/home") */}
        <Route path="/home" element={<Homepage />} />
      </Routes>
  );
}
