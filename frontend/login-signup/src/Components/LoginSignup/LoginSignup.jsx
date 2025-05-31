// src/Components/LoginSignup/LoginSignup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './LoginSignup.css';            

import user_icon     from '../Assets/user_icon.png';
import email_icon    from '../Assets/email_icon.png';
import password_icon from '../Assets/password_icon.png';

// Import the FontAwesome eye/eye-slash icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginSignup() {
  // State for each input + individual error flags + toggle
  const [fullName, setFullName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError]       = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword]   = useState(false);

  const navigate = useNavigate();

  // “Sign Up” button handler
  const handleSignUp = () => {
    // Clear previous error flags
    setFullNameError(false);
    setEmailError(false);
    setPasswordError(false);

    let hasError = false;

    // Validation for each field individually
    if (!fullName.trim()) {
      // Prevents user from moving forward if Full Name is empty
      setFullNameError(true);
      hasError = true;
    }
    if (!email.trim()) {
      // Prevents user from moving forward if Email is empty
      setEmailError(true);
      hasError = true;
    }
    if (!password.trim()) {
      // Prevents user from moving forward if Password is empty
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      // If any field is empty, stop here and show errors
      return;
    }

    console.log('(Stub) Signing up with:', { fullName, email, password });
    // Add real sign-up (Firebase)
    // Redirect to /home after a successful (stub) sign-up:
    navigate('/home', { replace: true });
  };

  // “Login” button on this page navigates to /login
  const handleGoToLogin = () => {
    navigate('/login'); // Takes user to login page when button is clicked
  };

  // Render
  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="text">Sign up</div>
        <div className="underline"></div>
      </div>

      {/* Inputs */}
      <div className="inputs">
        {/* Full Name Input */}
        <div className={`input ${fullNameError ? 'error' : ''}`}>
          <img src={user_icon} alt="User icon" /> {/* Image for user icon */}
          <input
            type="text"
            placeholder="Full Name" // Grey placeholder text when field is empty
            value={fullName}  // Comes from the React state variable 'fullName'
            onChange={(e) => {  // When user types, this function runs
              setFullName(e.target.value);  // Update 'fullName' state to match what the user typed
              if (fullNameError) setFullNameError(false);  // Clear specific error once user starts typing
            }}
          />
        </div>
        {/* Show error message under Full Name if empty */}
        {fullNameError && (
          <p className="field-error">Please enter a value for Full Name.</p>
        )}

        {/* Email Input */}
        <div className={`input ${emailError ? 'error' : ''}`}>
          <img src={email_icon} alt="Email icon" /> {/* Image for email icon */}
          <input
            type="email"
            placeholder="Email" // Grey placeholder text when field is empty
            value={email}  // Comes from the React state variable 'email'
            onChange={(e) => {  // When user types, this function runs
              setEmail(e.target.value); // Update 'email' state to match what the user typed
              if (emailError) setEmailError(false);  // Clear specific error once user starts typing
            }}
          />
        </div>
        {/* Show error message under Email if empty */}
        {emailError && (
          <p className="field-error">Please enter a value for Email.</p>
        )}

        {/* Password with eye toggle */}
        <div
          className={`input ${passwordError ? 'error' : ''}`}
          // If 'passwordError' is true, attach the "error" class. This gives the red border.
          style={{ position: 'relative' }} //Sets this container’s position to "relative" so that the eye‐icon <span> can sit inside it.
        >
          <img src={password_icon} alt="Password icon" /> {/* Image for password icon */}

          <input
            /* 'showPassword' determines field's type
               - If 'showPassword' is true, type="text" is used and makes password visible
               - If 'showPassword' is false, type="password" is used and makes password non-visible
            */
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password"  // Grey text placeholder when field is empty
            value={password}  // Value comes from the 'password' state variable
            onChange={(e) => {  // When user types, this function runs
              setPassword(e.target.value);  // Update 'password' state to match user's input
              if (passwordError) setPasswordError(false);  // Clear specific error once user starts typing
            }}
            style={{ paddingRight: '2.5rem' }} // Add padding so eye icon doesn’t overlap text
          />

          <span
            onClick={() => setShowPassword(prev => !prev)}
            className={`toggle-icon ${passwordError ? 'error' : ''}`}
          >
            {/* Based on 'showPassword,' the appropriate icon will display
              - If 'showPassword' is true (password is visible), render FaEyeSlash
              - If 'showPassword' is false (password is hidden), render FaEye
            */}
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {/* Show error message under Password if empty */}
        {passwordError && (
          <p className="field-error">Please enter a value for Password.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="submit-container">
        <div className="submit" onClick={handleSignUp}> {/* Sign up button */}
          Sign Up
        </div>
        <div className="submit" onClick={handleGoToLogin}>  {/* Login button */}
          Login
        </div>
      </div>
    </div>
  );
}
