
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//Import sidebar for nav
import Sidebar from "../Sidebar/Sidebar";

import { handleSignout } from "../../services/authHandlers";


import JdFromUrl from "../JdForm/JdFromUrl";
import JdFromText from "../JdForm/JdFromText";

// Import the PDF upload logic from UploadPdf/UploadPdf.jsx
import UploadPdf from "../UploadPdf/UploadPdf";

// Import Resume Library and PDF manipulation functionality (view, delete, set master)
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";

import "./TailorResume.css";
import "../Sidebar/Sidebar.css";

export default function TailorResume() {
  // local state to store the current Firebase user
  const [user, setUser] = useState(null);
  // used for gemini explanation
  const [jdExplanation, setJdExplanation] = useState("");

  // State variables for the error handling
  const [urlError, setUrlError] = useState("");
  const [highlightTextInput, setHighlightTextInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); //update the user with the current user with the onAuthStateChanged to change the current user to the current one
    });
    // clean up the listener when the component clears
    return () => unsubscribe();
  }, []);

  //if it works clean the error
  const handleExplanationReceived = (explanation, skills) => {
    setJdExplanation(explanation);
    // clear error if successful 
    setUrlError("");
    setHighlightTextInput(false);
    // You can handle skills here if needed, or just ignore the parameter
  };

  // funciton for handling the errors 
  const handleUrlError = (errorMessage) => {
    setUrlError(errorMessage);
    setHighlightTextInput(true);
    setJdExplanation("");

    // stop after 5 seconds 
    setTimeout(() => {
      setHighlightTextInput(false);
    }, 5000); // 5000ms = 5 seconds
  };

  const handleTextInputFocus = () => {
    setUrlError("");
    setHighlightTextInput(false);
  };

  const handleSignOutOnClick = async () => {
    try {
      await handleSignout();
      navigate("/", { replace: true });
    } catch (err) {
      console.log("Sign Out Error", err);
    }
  };
  const [headerActive, setHeaderActive] = useState(false);

  return (
    <>
      <div className="tailor-container">
        {user ? (
          <>
            <div>
            {user && <Sidebar user={user} />}
            </div>

            <div className="outsidepdf-box"> Upload Resume
              <div className="uploadpdf-box"><UploadPdf /></div>
            </div>
            
            <div><ResumeLibrary /></div>

            <JdFromUrl 
              user={user} 
              onExplanationReceived={handleExplanationReceived}
              onError={handleUrlError}
            />

            
            {urlError && (
                <div className="url-error-message">
              {urlError}
              </div>
            )}

            <div style={{ margin: '20px 0', textAlign: 'center' }}>
              <strong>--- OR ---</strong>
            </div>

            <div className={highlightTextInput ? 'text-input-highlight' : ''}>

            <JdFromText 
              user={user} 
              onExplanationReceived={handleExplanationReceived}
              onFocus={handleTextInputFocus}
            />
            </div>

            {jdExplanation && (
              <div className="jd-explanation">
                <h3>Gemini's Explanation</h3>
                <p>{jdExplanation}</p>
              </div>
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