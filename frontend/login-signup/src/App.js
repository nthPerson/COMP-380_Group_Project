// src/App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import LoginSignup from './Components/LoginSignup/LoginSignup';
import LoginOnly   from './Components/LoginOnly/LoginOnly';   
import Homepage    from './Components/Homepage/Homepage';     
import ForgotPassword    from './Components/ForgotPassword/ForgotPassword';
import LandingPage    from './Components/LandingPage/LandingPage';
import Navbar from "./Components/NavBar/Navbar.jsx";


function App() {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/signup"];
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/login" element={<LoginOnly />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </>
  );
}

export default App;
