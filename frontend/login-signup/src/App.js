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
        <Route path="/" element={<Homepage />} />

        {/* Path “/login” shows login form*/}
        <Route path="/login" element={<LoginOnly />} />

        {/* Path “/signup” shows LoginSignup */}
        <Route path="/signup" element={<LoginSignup />} />

        {/* After successful sign-up, navigate("/home") */}
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  );
}
