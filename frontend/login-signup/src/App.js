// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginOnly   from './Components/LoginOnly/LoginOnly';   // if you have a separate LoginOnly.jsx
import Homepage    from './Components/Homepage/Homepage';     // your “/home” component

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Path “/” shows the signup form */}
        <Route path="/" element={<LoginSignup />} />

        {/* Path “/login” shows your login form (if you built one) */}
        <Route path="/login" element={<LoginOnly />} />

        {/* After successful sign-up, you do navigate("/home") */}
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}
