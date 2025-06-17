// src/pages/TailorResume.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import AOS from "aos";

import { auth } from "../../firebase";
import { handleSignout } from "../../services/authHandlers";
import { usePdf } from "../PdfContext";

import Sidebar from "../Sidebar/Sidebar";
import JdFromUrl from "../JdForm/JdFromUrl";
import JdFromText from "../JdForm/JdFromText";
import UploadPdf from "../UploadPdf/UploadPdf";
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";
import ProfileExtractor from "../ProfileExtractor/ProfileExtractor";

import "aos/dist/aos.css";
import "./TailorResume.css";
import "../Sidebar/Sidebar.css";

export default function TailorResume() {
  const [user, setUser] = useState(null);
  const [jdExplanation, setJdExplanation] = useState("");
  const [jdContent, setJdContent] = useState("");
  const [urlError, setUrlError] = useState("");
  const [highlightTextInput, setHighlightTextInput] = useState(false);

  const navigate = useNavigate();
  const { masterDocID } = usePdf();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const handleExplanationReceived = (explanation, rawText) => {
    setJdExplanation(explanation);
    setJdContent(rawText);
    setUrlError("");
    setHighlightTextInput(false);
  };

  const handleUrlError = (message) => {
    setUrlError(message);
    setHighlightTextInput(true);
    setJdExplanation("");
    setTimeout(() => setHighlightTextInput(false), 5000);
  };

  const handleTextInputFocus = () => {
    setUrlError("");
    setHighlightTextInput(false);
  };

  const handleSignOut = async () => {
    try {
      await handleSignout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Sign Out Error", err);
    }
  };

  if (!user) {
    return (
      <p className="loading-text">
        <span className="spinner" /> Loading...
      </p>
    );
  }

  return (
    <div className="tailor-container">
      <Sidebar user={user} />

      <header className="header" data-aos="fade-down">
        <h1 className="welcome-title">
          Welcome, {user.displayName || "User"} 👋
        </h1>
        <p className="welcome-subtext">
          You're logged in as <strong>{user.email}</strong>
        </p>
      </header>

      <ToolSection title="Upload Resume" delay={100}>
        <p className="section-subtext">
          Start by uploading a PDF resume to tailor it to a job description.
        </p>
        <UploadPdf />
      </ToolSection>

      <ToolSection title="Resume Library" delay={200}>
        <p className="section-subtext">
          Access your saved resumes and manage document versions.
        </p>
        <ResumeLibrary />
      </ToolSection>

      <ToolSection title="Paste a Job Description (URL)" delay={300}>
        <p className="section-subtext">
          Paste a job post link and we’ll extract relevant insights.
        </p>
        <JdFromUrl
          user={user}
          onExplanationReceived={handleExplanationReceived}
          onError={handleUrlError}
        />
        {urlError && <div className="url-error-message">{urlError}</div>}
      </ToolSection>

      <div className="divider">
        <strong>— OR —</strong>
      </div>

      <ToolSection
        title="Paste a Job Description (Text)"
        delay={400}
        extraClass={highlightTextInput ? "highlighted-section" : ""}
      >
        <p className="section-subtext">
          Prefer to copy-paste instead? Paste the text and get started
          instantly.
        </p>
        <JdFromText
          user={user}
          onExplanationReceived={handleExplanationReceived}
          onFocus={handleTextInputFocus}
        />
      </ToolSection>

      {jdExplanation && (
        <ToolSection title="Gemini's Explanation" delay={500}>
          <p className="section-subtext">
            AI-generated insights from your uploaded job description.
          </p>
          <p>{jdExplanation}</p>
        </ToolSection>
      )}

      {masterDocID && jdContent && (
        <ToolSection title="Profile Extractor" delay={600}>
          <p className="section-subtext">
            Extract key info and tailor your resume for better alignment.
          </p>
          <ProfileExtractor masterDocID={masterDocID} jdText={jdContent} />
        </ToolSection>
      )}

      <div className="logout-container">
        <button className="logout-btn" onClick={handleSignOut}>
          Log Out
        </button>
      </div>
    </div>
  );
}

function ToolSection({ title, delay = 0, extraClass = "", children }) {
  return (
    <section
      className={`tool-section ${extraClass}`.trim()}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <h2>{title}</h2>
      {children}
    </section>
  );
}
