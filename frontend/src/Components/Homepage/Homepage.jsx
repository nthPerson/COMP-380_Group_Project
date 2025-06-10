// src/Components/Homepage/Homepage.jsx

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { handleSignout } from "../../services/authHandlers";


import JdFromUrl from "../JdForm/JdFromUrl";
import JdFromText from "../JdForm/JdFromText";

// Import the PDF upload logic from UploadPdf/UploadPdf.jsx
import UploadPdf from "../UploadPdf/UploadPdf";

// Import Resume Library and PDF manipulation functionality (view, delete, set master)
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";
import { getMasterResumeKeywords } from "../../services/resumeService";

import "./Homepage.css";

export default function Homepage() {
  // local state to store the current Firebase user
  const [user, setUser] = useState(null);
  // used for gemini explanation
  const [jdExplanation, setJdExplanation] = useState("");
  const navigate = useNavigate();
  // Used for keyword extraction from JD and master resume
  const [jdKeywords, setJdKeywords] = useState([]);
  const [resumeKeywords, setResumeKeywords] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); //update the user with the current user with the onAuthStateChanged to change the current user to the current one
    });
    // clean up the listener when the component clears
    return () => unsubscribe();
  }, []);

  const handleExplanationReceived = (explanation) => {
    setJdExplanation(explanation);
  };

  const handleKeywordsReceived = (keywords) => {
    setJdKeywords(keywords);
  };

  const removeJdKeyword = (kw) => {
    setJdKeywords((prev) => prev.filter((k) => k !== kw));
  }

  const fetchResumeKeywords = async () => {
    try {
      const res = await getMasterResumeKeywords();
      setResumeKeywords(res.keywords || []);
    } catch {
      alert("Failed to fetch resume keywords");
    }
  };

  const handleSignOutOnClick = async () => {
    try {
      await handleSignout();
      navigate("/", { replace: true });
    } catch (err) {
      console.log("Sign Out Error", err);
    }
  };

  return (
    <>
      {/* ─── MAIN CONTENT ─── */}
      <div className="homepage-container">
        {user ? (
          <>
            <h1>Welcome, {user.displayName || "User"}!</h1>
            <p>You are now logged in and on the Home page.</p>
            <p>Email: {user.email}</p>

            <UploadPdf />  
            <ResumeLibrary />

            <JdFromUrl 
              user={user} 
              onExplanationReceived={handleExplanationReceived} 
              onKeywordsReceived={handleKeywordsReceived}
            />

            <div style={{ margin: '20px 0', textAlign: 'center' }}>
              <strong>--- OR ---</strong>
            </div>

            <JdFromText 
              user={user} 
              onExplanationReceived={handleExplanationReceived}
              onKeywordsReceived={handleKeywordsReceived}
            />

            {jdExplanation && (
              <div className="jd-explanation">
                <h3>Gemini's Explanation</h3>
                <p>{jdExplanation}</p>
              </div>
            )}

            {jdKeywords.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3>JD Keywords</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {jdKeywords.map((kw) => (
                    <li key={kw} style={{ marginBottom: 4 }}>
                      {kw}{" "}
                      <button onClick={() => removeJdKeyword(kw)}>x</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginTop: 20 }}>
                <button onClick={fetchResumeKeywords}>Load Resume Keywords</button>
                {resumeKeywords.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
                    {resumeKeywords.map((kw) => (
                      <li key={kw}>{kw}</li>
                    ))}
                  </ul>
                )}
            </div>

            <button onClick={handleSignOutOnClick}>Logout</button>
          </>
        ) : (
          <p>Loading user...</p>
        )}
      </div>
    </>
  );
}
