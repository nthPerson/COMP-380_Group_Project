// src/Components/Homepage/Homepage.jsx

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
// import { Link } from "react-router-dom";  // Not currently using
import { useNavigate } from "react-router-dom";

import { handleSignout } from "../../services/authHandlers";


import JdFromUrl from "../JdForm/JdFromUrl";
import JdFromText from "../JdForm/JdFromText";

// Import the PDF upload logic from UploadPdf/UploadPdf.jsx
import UploadPdf from "../UploadPdf/UploadPdf";

// Import Resume Library and PDF manipulation functionality (view, delete, set master)
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";

// Import SkillHighlighter (what we're currently using to test skill extraction behavior)
import SkillHighlighter from "../SkillHighlighter/SkillHighlighter";

import "./Homepage.css";

export default function Homepage() {
  // local state to store the current Firebase user
  const [user, setUser] = useState(null);
  // used for gemini explanation
  const [jdExplanation, setJdExplanation] = useState("");
  // State for skill extraction
  const [jdSkills, setJdSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); //update the user with the current user with the onAuthStateChanged to change the current user to the current one
    });
    // clean up the listener when the component clears
    return () => unsubscribe();
  }, []);

  const handleExplanationReceived = (explanation, skills) => {
    setJdExplanation(explanation);
    setJdSkills(skills);
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
            />

            <div style={{ margin: '20px 0', textAlign: 'center' }}>
              <strong>--- OR ---</strong>
            </div>

            <JdFromText 
              user={user} 
              onExplanationReceived={handleExplanationReceived} 
            />

            {jdExplanation && (
              <>
                <div className="jd-explanation">
                  <h3>Gemini's Explanation</h3>
                  <p>{jdExplanation}</p>
                </div>
                <SkillHighlighter jobSkills={jdSkills} />
              </>
            )}

            <button onClick={handleSignOutOnClick}>Logout</button>
          </>
        ) : (
          <p>Loading user...</p>
        )}
      </div>
    </>
  );
}
