import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";  //Import sidebar for nav
import { handleSignout } from "../../services/authHandlers";
import JdFromUrl from "../JdForm/JdFromUrl";  // "Enter Job Posting URL" text box and corresponding button
import JdFromText from "../JdForm/JdFromText";  // "Paste a Job Description" text box and corresponding button
import UploadPdf from "../UploadPdf/UploadPdf";  // File upload utility
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";  // Resume Library and PDF manipulation functionality (view, delete, set master)
import ProfileExtractor from "../ProfileExtractor/ProfileExtractor";  // Resume/job descrption profile panes (only appear after choosing master resume and entering job descirpion)
import { usePdf } from "../PdfContext";

import "./Homepage.css";
import "../Sidebar/Sidebar.css";

export default function Homepage() {
  const navigate = useNavigate();
  // local state to store the current Firebase user
  const [user, setUser] = useState(null);
  // used for gemini explanation
  const [jdExplanation, setJdExplanation] = useState("");
  // Get masterDocID (identifier for master resume) from PdfContext
  const { masterDocID } = usePdf();
  
  // State for JD and resume profile extraction (like skill extraction but all important stuff gets extracted instead of only skills)
  const [jdContent, setJdContent] = useState("");
  
  // Uses a listener to keep the user state in sync with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); //update the user with the current user with the onAuthStateChanged to change the current user to the current one
    });
    // clean up the listener when the component clears
    return () => unsubscribe();
  }, []);

  const handleSignOutOnClick = async () => {
    try {
      await handleSignout();
      navigate("/", { replace: true });
    } catch (err) {
      console.log("Sign Out Error", err);
    }
  };
  // const [headerActive, setHeaderActive] = useState(false);

  return (

      <div className="homepage-container">
        {user ? (
          <>
            <div>
            {user && <Sidebar user={user} />}
            </div>
            {/* ─── MAIN CONTENT ─── */}

            <h1>Welcome, {user.displayName || "User"}!</h1>
            <p>You are now logged in and on the Home page.</p>
            <p>Email: {user.email}</p>

          <UploadPdf />
          <ResumeLibrary />

          <JdFromUrl
            user={user}
            onExplanationReceived={(exp, rawText) => {
              setJdExplanation(exp);
              setJdContent(rawText);
            }}
          />

          <div style={{ margin: '20px 0', textAlign: 'center' }}>
            <strong>--- OR ---</strong>
          </div>

          <JdFromText
            user={user}
            onExplanationReceived={(exp, rawText) => {
              setJdExplanation(exp);
              setJdContent(rawText);
            }}
          />

          {jdExplanation && (
            <div className="jd-explanation">
              <h3>Gemini's Explanation</h3>
              <p>{jdExplanation}</p>
            </div>
          )}

          {masterDocID && jdContent && (
            <ProfileExtractor
              masterDocID={masterDocID}
              jdText={jdContent}
            />
          )}

          <button onClick={handleSignOutOnClick}>Logout</button>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
