import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-hero">
        <h1>Welcome to ReZume</h1>
        <p>
          Create AI-enhanced resumes that pass ATS filters and highlight your
          best skills.
        </p>
        <div className="landing-buttons">
          <a href="/signup" className="btn primary">
            Get Started
          </a>
          <a href="/about" className="btn secondary">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
