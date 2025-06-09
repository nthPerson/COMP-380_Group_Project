import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginSignup/LoginSignup.css";

import email_icon from "../Assets/email_icon.png";
import password_icon from "../Assets/password_icon.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

//testing
import { handleLogin, handlePasswordReset } from "../../services/authHandlers";

export default function LoginOnly() {
  // State for email & password fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Field-specific error flags + an error message
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // Toggle for show/hide password

  const navigate = useNavigate();

  // “Login” button handler
  const handleLoginSubmit = async () => {
    // Clear previous errors
    setEmailError(false);
    setPasswordError(false);
    setErrorMsg("");

    // error handling for login
    try {
      const user = await handleLogin(email, password);
      console.log("Logged in:", user.email);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login failed:", err.message);

      switch (err.code) {
        case "empty-fields":
          if (!email) setEmailError(true);
          if (!password) setPasswordError(true);
          setErrorMsg("Please enter both email and password.");
          break;

        case "auth/invalid-email":
        case "invalid-email-format":
          setEmailError(true);
          setErrorMsg("Please enter a valid email address.");
          break;

        case "auth/user-not-found":
          setEmailError(true);
          setErrorMsg("No user found with this email.");
          break;

        case "auth/invalid-credential":
          setPasswordError(true);
          setErrorMsg("Incorrect password or Email.");
          break;

        case "auth/too-many-requests":
          setErrorMsg("Too many failed attempts. Try again later.");
          break;

        default:
          setErrorMsg("Login failed. Please try again.");
      }
    }
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
        <div className={`input ${emailError ? "error" : ""}`}>
          <img src={email_icon} alt="Email icon" /> {/* Image for email icon */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              // When user types, this function runs
              setEmail(e.target.value); // Update 'email' state to match what the user typed
              if (emailError) setEmailError(false);
              if (errorMsg) setErrorMsg(""); // Error message clears once user starts typing again
            }}
          />
        </div>

        {/* Password with eye toggle */}
        <div
          className={`input ${passwordError ? "error" : ""}`}
          style={{ position: "relative" }}
        >
          <img src={password_icon} alt="Password icon" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(false);
              if (errorMsg) setErrorMsg("");
            }}
            style={{ paddingRight: "2.5rem" }}
          />

          <span
            className={`toggle-icon ${passwordError ? "error" : ""}`}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      {/* Inline error message */}
      {errorMsg && (
        <p className={successMsg ? "success-message" : "error-message"}>
          {errorMsg}
        </p>
      )}

      {/* “Forgot Password?” (stub) */}
      <div className="forgot-password">
        Forgot Password?
        <span
          style={{ cursor: "pointer", color: "var(--primary)" }}
          onClick={async () => {
            setEmailError(false);
            setErrorMsg("");
            try {
              await handlePasswordReset(email);
              setSuccessMsg(true);
              setErrorMsg("Password reset email sent. Check your inbox.");
            } catch (err) {
              if (err.message === "empty-email") {
                setEmailError(true);
                setErrorMsg("Please enter your email.");
              } else if (err.message === "invalid-email-format") {
                setEmailError(true);
                setErrorMsg("Please enter a valid email address.");
              } else {
                console.error("Password Reset failed", err.message);
                setErrorMsg("Failed to send reset email. Try again.");
              }
            }
          }}
        >
          {" "}
          Click here!
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
