import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Signup/Signup.css";
import logo_icon from '../../Assets/logo_icon.png';
import email_icon from "../../Assets/email_icon.png";
import password_icon from "../../Assets/password_icon.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

//testing
import { handleLogin, handlePasswordReset } from "../../../services/authHandlers";

export default function LoginOnly() {
  // State for email & password fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Field-specific error flags + an error message
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // Toggle for show/hide password

  const navigate = useNavigate();

  // “Login” button handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    if (loading) return;
    setLoading(true);
    // error handling for login
    try {
      const user = await handleLogin(email, password);
      console.log("Logged in:", user.email);
      // navigate("/home", { replace: true });
      // navigate("/userProfile", { replace: true });
      navigate("/welcome", { replace: true });
    } catch (err) {
      console.error("Login failed:", err.message);

      switch (err.code) {
        case "empty-fields":
          if (!email) setEmailError("Please enter your email.");
          if (!password) setPasswordError("Please enter your password.");
          setLoading(false);
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
          setErrorMsg("Incorrect password or Email.");
          break;

        case "auth/too-many-requests":
          setErrorMsg("Too many failed attempts. Try again later.");
          break;

        default:
          setErrorMsg("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  // NEW: pull your forgot-password logic into its own async fn
  const handleForgotPassword = async () => {
    // clear any old messages
    setEmailError("");
    setErrorMsg("");
    setSuccessMsg("");

    // 1) fast-fail if there's no email in the field
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      setErrorMsg("Please enter your email.");
      return;
    }

    // 2) call your service
    try {
      await handlePasswordReset(email);
      // 3) on success, show a friendly confirmation
      setSuccessMsg("Reset password link sent to email");
    } catch (err) {
      // 4) your existing error cases…
      if (err.message === "invalid-email-format") {
        setEmailError("Please enter a valid email address.");
        setErrorMsg("Please enter a valid email address.");
      } else {
        console.error("Password Reset failed", err);
        setErrorMsg("Failed to send reset email. Try again.");
      }
    }
  };

  return (
    <>
      <header className="site-banner">
        <div className="top-line"></div>
        <div className="banner-content" >
          <div className="banner-left">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <img src={logo_icon} alt="Logo icon" className="banner-logo" />
              <span className="banner-title">
                <span className="light-blue">Rezu</span>
                <span className="solid-blue">Me</span>
              </span>
            </Link>
          </div>
        </div>
      </header>
      <div className="container" style={{ position: 'relative', top: '4rem' }}>
        {/* Header */}
        <div className="header">
          <div className="text">Log In</div>
          <div className="underline"></div>
        </div>

        {/* Input fields */}
        <form className="inputs" onSubmit={handleLoginSubmit} noValidate>
          {/* Email Input */}
          <div className={`input ${emailError ? "error" : ""}`}>
            <img src={email_icon} alt="Email icon" /> {/* Image for email icon */}
            <input
              autoFocus
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                // When user types, this function runs
                setEmail(e.target.value);
                if (emailError) setEmailError("");
                if (errorMsg) setErrorMsg("");
                if (successMsg) setSuccessMsg("");
              }}
              required
            />
          </div>
          {emailError && (
            <p className="field-error">{emailError}</p>
          )}

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
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
                if (errorMsg) setErrorMsg("");
                if (successMsg) setSuccessMsg("");
              }}
              style={{ paddingRight: "2.5rem" }}
              required
            />

            <span
              className={`toggle-icon ${passwordError ? "error" : ""}`}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && (<p className="field-error">{passwordError}</p>
          )}
          {/* “Forgot Password?” (stub) */}
          <div className="forgot-password">
            Forgot Password?
            <span
              style={{ cursor: "pointer", color: "var(--primary)" }}
              onClick={handleForgotPassword}
            >
              {" "}
              Click here!
            </span>
          </div>
          {/* now render your messages just below the form */}
          {!emailError && !passwordError && errorMsg && (
            <p className="field-error">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="field-success">{successMsg}</p>
          )}

          <div className="submit-container">
            <button
              type="button"
              className="submit back"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            {/* Login button */}

            <button type="submit" className="submit" >
              Login
            </button>
          </div>
        </form>

      </div>
    </>
  );
}
