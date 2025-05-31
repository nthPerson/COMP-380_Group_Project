import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginSignup/LoginSignup.css';  

import email_icon    from '../Assets/email_icon.png';
import password_icon from '../Assets/password_icon.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginOnly() {
  // State for email & password fields
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // Field-specific error flags + an error message
  const [emailError, setEmailError]       = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMsg, setErrorMsg]           = useState('');

  const [showPassword, setShowPassword] = useState(false);  // Toggle for show/hide password

  const navigate = useNavigate();

  // “Login” button handler
  const handleLoginSubmit = () => {
    // Clear previous errors
    setEmailError(false);
    setPasswordError(false);
    setErrorMsg('');

    // Check for blank fields
    if (!email || !password) {
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      // If inputs are incorrect or blank, displays error message
      setErrorMsg('Please enter both email and password to log in.');
      return;
    }

    // Credential check (replace with real logic)
    if (password !== 'correctpassword') {
      setPasswordError(true);
      setErrorMsg('Incorrect password. Try again.');
      return;
    }

    // After successful login, redirect user to /home
    navigate('/home', { replace: true });
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="text">Log In</div>
        <div className="underline"></div>
      </div>

      {/* Input fields */}
      <div className="inputs">
        {/* Email Input */}
        <div className={`input ${emailError ? 'error' : ''}`}>
          <img src={email_icon} alt="Email icon" /> {/* Image for email icon */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {  // When user types, this function runs
              setEmail(e.target.value); // Update 'email' state to match what the user typed
              if (emailError) setEmailError(false);
              if (errorMsg)   setErrorMsg('');  // Error message clears once user starts typing again
            }}
          />
        </div>

        {/* Password with eye toggle */}
        <div
          className={`input ${passwordError ? 'error' : ''}`}
          style={{ position: 'relative' }}
        >
          <img src={password_icon} alt="Password icon" />

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
                if (passwordError) setPasswordError(false);
                if (errorMsg) setErrorMsg('');
            }}
            style={{ paddingRight: '2.5rem' }}
          />

          <span
            className={`toggle-icon ${passwordError ? 'error' : ''}`}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      {/* Inline error message */}
      {errorMsg && <p className="error-message">{errorMsg}</p>}

      {/* “Forgot Password?” (stub) */}
      <div className="forgot-password">
        Forgot Password?
        <span
          style={{ cursor: 'pointer', color: 'var(--primary)' }}
          onClick={() => {
            if (errorMsg) setErrorMsg('');
            console.log('Forgot Password clicked (stub).');
          }}>{' '}Click here!</span>
      </div>

      {/* Login button */}
      <div className="submit-container">
        <div className="submit" onClick={handleLoginSubmit}>
          Login
        </div>
      </div>
    </div>
  );
}

