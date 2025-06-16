// src/Components/Homepage/Homepage.jsx

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

//Import sidebar for nav
import Sidebar from "../Sidebar/Sidebar";

import { handleSignout } from "../../services/authHandlers";
import JdFromUrl from "../JdForm/JdFromUrl";
import JdFromText from "../JdForm/JdFromText";
// Import the PDF upload logic from UploadPdf/UploadPdf.jsx
import UploadPdf from "../UploadPdf/UploadPdf";  // Moved PDF upload logic to PdfContext.js, but UploadPdf.jsx uses PdfContext
// Import Resume Library and PDF manipulation functionality (view, delete, set master)
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";
import ProfileExtractor from "../ProfileExtractor/ProfileExtractor";
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
  // const [jdIsUrl, setJdIsUrl] = useState(false);
  
  // Uses a listener to keep the user state in sync with Firebase
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
  // const handleExplanationReceived = (explanation) => {
  //   setJdExplanation(explanation);
  //   // setJdSkills(skills);
  //   // JdContent and jdIsUrl will be set in the child forms (aka the HTML returned below)
  // };

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
  // return (
  //   <>
  //     {/* ─── MAIN CONTENT ─── */}
  //     <div className="homepage-container">
  //       {user ? (
  //         <>
  //           <h1>Welcome, {user.displayName || "User"}!</h1>
  //           <p>You are now logged in and on the Home page.</p>
  //           <p>Email: {user.email}</p>

  //           <UploadPdf />  
  //           <ResumeLibrary />

  //           <JdFromUrl 
  //             user={user} 
  //             onExplanationReceived={(exp, rawText) => {
  //               setJdExplanation(exp);
  //               setJdContent(rawText);
  //               setJdIsUrl(true);
  //             }}
  //           />

  //           <div style={{ margin: '20px 0', textAlign: 'center' }}>
  //             <strong>--- OR ---</strong>
  //           </div>

  //           <JdFromText 
  //             user={user} 
  //             onExplanationReceived={(exp, rawText) => {
  //               setJdExplanation(exp);
  //               setJdContent(rawText);
  //               setJdIsUrl(false);
  //             }}
  //           />

  //           {jdExplanation && (
  //             <>
  //               <div className="jd-explanation">
  //                 <h3>Gemini's Explanation</h3>
  //                 <p>{jdExplanation}</p>
  //               </div>
                
  //             </>
  //           )}

  //           {/* Full-featured extractor (must first have both masterDocID and JD content) */}
  //           { masterDocID && jdContent && (
  //             <ProfileExtractor
  //             masterDocID={masterDocID}
  //             jdText={ jdIsUrl ? "" : jdContent }
  //             jdUrl={ jdIsUrl ? jdContent : "" }
  //             />
  //           )}

  //           {/* <SkillHighlighter jobSkills={jdSkills} /> */}

  //           <button onClick={handleSignOutOnClick}>Logout</button>
  //         </>
  //       ) : (
  //         <p>Loading user...</p>
  //       )}
  //     </div>
  //   </>
  // );


// old JdFromUrl and JdFromText tags
// <JdFromUrl 
//   user={user} 
//   onExplanationReceived={handleExplanationReceived} 
// />

// <JdFromText 
//   user={user} 
//   onExplanationReceived={handleExplanationReceived} 
// />