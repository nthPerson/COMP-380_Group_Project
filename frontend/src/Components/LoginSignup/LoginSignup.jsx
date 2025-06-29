import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

import user_icon from "../Assets/user_icon.png";
import email_icon from "../Assets/email_icon.png";
import password_icon from "../Assets/password_icon.png";

// Import the FontAwesome eye/eye-slash icons
import { FaEye, FaEyeSlash } from "react-icons/fa";
// ── NEW: import the circle/check icons for the checklist
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";

import {handleSignup} from "../../services/authHandlers";

export default function LoginSignup() {
  // State for each input + individual error flags + toggle
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Regular expressions for validation
  // const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordLengthRegex   = /^.{6,}$/;  // At least 8 characters
  const passwordNumberRegex   = /[0-9]/;  // At least one digit      
  const passwordLowercaseRegex= /[a-z]/;  // At least one lowercase letter
  const passwordUppercaseRegex= /[A-Z]/;  // At least one uppercase letter                   
  const passwordSpecialRegex  = /[!@#$%^&*(),.?":{}|<>]/; // At least one special symbol

  // “Sign Up” button handler
  const handleSignUp = async () => {
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
    } else {
      // Check each requirement one by one
      if (!passwordLengthRegex.test(password)) {
        setPasswordError(true);
        hasError = true;
      }
      if (!passwordNumberRegex.test(password)) {
        setPasswordError(true);
        hasError = true;
      }
      if (!passwordLowercaseRegex.test(password)) {
        setPasswordError(true);
        hasError = true;
      }
      if (!passwordUppercaseRegex.test(password)) {
        setPasswordError(true);
        hasError = true;
      }
      if (!passwordSpecialRegex.test(password)) {
        setPasswordError(true);
        hasError = true;
      }
    }

    if (hasError) {
      // If any field is empty, stop here and show errors
      return;
    }
    try {
      const user = await handleSignup(fullName, email, password);
      console.log("Signed up:", user.email, "| Name:", user.displayName);
      // navigate("/home");
      navigate("/userProfile");
    } catch (err) {
      console.error("Signup failed:", err.code);
    
      switch (err.code) {
        case "auth/email-already-exists":
          setEmailError(true);
          alert("An account with this email already exists.");
          break;
        case "auth/invalid-email":
          setEmailError(true);
          alert("Please enter a valid email address.");
          break;
        case "auth/invalid-password":
          setPasswordError(true);
          alert("Password should be at least 6 characters.");
          break;
        case "empty-fields":
          if (!fullName) setFullNameError(true);
          if (!email) setEmailError(true);
          if (!password) setPasswordError(true);
          alert("Please fill out all fields.");
          break;
        default:
          alert("Signup failed. Please try again.");
      }
    }
  };

  // “Login” button on this page navigates to /login
  const handleGoToLogin = () => {
    navigate("/login"); // Takes user to login page when button is clicked
  };
  // Compute each password‐requirement boolean for the checklist UI
  const isLongEnough    = passwordLengthRegex.test(password);    
  const hasNumber       = passwordNumberRegex.test(password);    
  const hasLowercase    = passwordLowercaseRegex.test(password); 
  const hasUppercase    = passwordUppercaseRegex.test(password); 
  const hasSpecialChar  = passwordSpecialRegex.test(password);   

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
        {/* Full Name Input, I added this since this was missing - Reza */}
        <div className={`input ${fullNameError ? "error" : ""}`}>
          <img src={user_icon} alt="User icon" />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (fullNameError) setFullNameError(false);
            }}
          />
        </div>
        
        {/* Show error message under Full Name if empty */}
        {fullNameError && (
          <p className="field-error">Please enter a value for Full Name.</p>
        )}

        {/* Email Input */}
        <div className={`input ${emailError ? "error" : ""}`}>
          <img src={email_icon} alt="Email icon" /> {/* Image for email icon */}
          <input
            type="email"
            placeholder="Email" // Grey placeholder text when field is empty
            value={email} // Comes from the React state variable 'email'
            onChange={(e) => {
              // When user types, this function runs
              setEmail(e.target.value); // Update 'email' state to match what the user typed
              if (emailError) setEmailError(false); // Clear specific error once user starts typing
            }}
          />
        </div>
        {/* Show error message under Email if empty */}
        {emailError && (
          <p className="field-error">Please enter a value for Email.</p>
        )
        }

        {/* Password with eye toggle */}
        <div
          className={`input ${passwordError ? "error" : ""}`}
          // If 'passwordError' is true, attach the "error" class. This gives the red border.
          style={{ position: "relative" }} //Sets this container’s position to "relative" so that the eye‐icon <span> can sit inside it.
        >
          <img src={password_icon} alt="Password icon" />{" "}
          {/* Image for password icon */}
          <input
            /* 'showPassword' determines field's type
               - If 'showPassword' is true, type="text" is used and makes password visible
               - If 'showPassword' is false, type="password" is used and makes password non-visible
            */
            type={showPassword ? "text" : "password"}
            placeholder="Password" // Grey text placeholder when field is empty
            value={password} // Value comes from the 'password' state variable
            onChange={(e) => {
              // When user types, this function runs
              setPassword(e.target.value); // Update 'password' state to match user's input
              if (passwordError) setPasswordError(false); // Clear specific error once user starts typing
            }}
            style={{ paddingRight: "2.5rem" }} // Add padding so eye icon doesn’t overlap text
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className={`toggle-icon ${passwordError ? "error" : ""}`}
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
         !password.trim() ? (
          <p className="field-error">Please enter a value for Password.</p>
        ) : (
          <p className="field-error">
            Password doesn’t meet requirements below.
          </p>
        )
        )}
      </div>
      
      <div className="password-requirements">
          <p className="requirements-heading">Password should be</p>
          <ul className="requirements-list">
            <li>
              {isLongEnough 
                ? <FaCheckCircle className="check-icon valid" /> 
                : <FaRegCircle className="check-icon" />}
              <span>At least 6 characters long</span>
            </li>
            <li>
              {hasNumber 
                ? <FaCheckCircle className="check-icon valid" /> 
                : <FaRegCircle className="check-icon" />}
              <span>At least 1 number (0…9)</span>
            </li>
            <li>
              {hasLowercase 
                ? <FaCheckCircle className="check-icon valid" /> 
                : <FaRegCircle className="check-icon" />}
              <span>At least 1 lowercase letter (a…z)</span>
            </li>
            <li>
              {hasSpecialChar 
                ? <FaCheckCircle className="check-icon valid" /> 
                : <FaRegCircle className="check-icon" />}
              <span>At least 1 special symbol (!…$)</span>
            </li>
            <li>
              {hasUppercase 
                ? <FaCheckCircle className="check-icon valid" /> 
                : <FaRegCircle className="check-icon" />}
              <span>At least 1 uppercase letter (A…Z)</span>
            </li>
          </ul>
        </div>
        {/* ─── END: Password Requirements Checklist UI ───────────────────────────────── */}
      

      {/* Buttons */}
      <div className="submit-container">
        <div className="submit" onClick={handleSignUp}>
          {" "}
          {/* Sign up button */}
          Sign Up
        </div>
        <div className="submit" onClick={handleGoToLogin}>
          {" "}
          {/* Login button */}
          Login
        </div>
      </div>
    </div>
  );
}
