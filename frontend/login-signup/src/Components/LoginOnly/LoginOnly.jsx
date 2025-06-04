import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginSignup/LoginSignup.css';  

//Firebase functionality methods from the firebase.js file 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

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
  const handleLoginSubmit = async () => {
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
    // error handling for login 
    try {
      // call the firebase function
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      //instantiate the user
      const user = userCredential.user;
      //for testing
      console.log("Logged in:", user.email);
      //navigate to home after login 
      navigate('/home', { replace: true });
    } catch (err) {
      console.error("Login failed:", err.message);

      // // Basic error handling for wrong password, user not found, etc. for testing 
      // if (err.code === 'auth/wrong-password') {
      //   setPasswordError(true);
      //   setErrorMsg('Incorrect password. Try again.');
      // } else if (err.code === 'auth/user-not-found') {
      //   setEmailError(true);
      //   setErrorMsg('No user found with this email.');
      // } else {
      //   setErrorMsg(err.message);
      // }

      // comprehensive error handling
      switch (err.code) {
        case 'auth/invalid-email':
          setEmailError(true);
          setErrorMsg('Please enter a valid email address.');
          break;
        case 'auth/user-disabled':
          setEmailError(true);
          setErrorMsg('This account has been disabled.');
          break;
        case 'auth/user-not-found':
          setEmailError(true);
          setErrorMsg('No user found with this email.');
          break;
        case 'auth/wrong-password':
          setPasswordError(true);
          setErrorMsg('Incorrect password. Try again.');
          break;
        case 'auth/too-many-requests':
          setErrorMsg('Too many failed attempts. Try again later.');
          break;
        default:
          setErrorMsg('Login failed. Please try again.');
      }
    }
  };
  const handleForgotPassword = () => {
    navigate("/forgotpassword");
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
          onClick={handleForgotPassword}
        >
          {' '}Click here!
        </span>
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

