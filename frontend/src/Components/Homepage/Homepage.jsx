import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import { handleSignout } from "../../services/authHandlers";
import JdFromUrl from "../JdForm/JdFromUrl";
import JdFromText from "../JdForm/JdFromText";
import UploadPdf from "../UploadPdf/UploadPdf";
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";
import ProfileExtractor from "../ProfileExtractor/ProfileExtractor";
import { usePdf } from "../PdfContext";

import AOS from "aos";
import "aos/dist/aos.css";

import "./Homepage.css";
import "../Sidebar/Sidebar.css";

export default function Homepage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jdExplanation, setJdExplanation] = useState("");
  const [jdContent, setJdContent] = useState("");
  const { masterDocID } = usePdf();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  const handleSignOutOnClick = async () => {
    try {
      await handleSignout();
      navigate("/", { replace: true });
    } catch (err) {
      console.log("Sign Out Error", err);
    }
  };

  return (
    <div className="homepage-layout">
      {user ? (
        <>
          <Sidebar user={user} />

          <div className="homepage-container">
            <div className="homepage-header" data-aos="fade-down">
              <h1 className="welcome-title">
                Welcome, {user.displayName || "User"} 👋
              </h1>
              <p className="welcome-subtext">
                You're logged in as <strong>{user.email}</strong>
              </p>
            </div>

            <div className="tool-section" data-aos="fade-up">
              <UploadPdf />
            </div>

            <div className="tool-section" data-aos="fade-up">
              <ResumeLibrary />
            </div>

            <div className="tool-section" data-aos="fade-up">
              <JdFromUrl
                user={user}
                onExplanationReceived={(exp, rawText) => {
                  setJdExplanation(exp);
                  setJdContent(rawText);
                }}
              />
            </div>

            <div className="divider">
              <strong>--- OR ---</strong>
            </div>

            <div className="tool-section" data-aos="fade-up">
              <JdFromText
                user={user}
                onExplanationReceived={(exp, rawText) => {
                  setJdExplanation(exp);
                  setJdContent(rawText);
                }}
              />
            </div>

            {jdExplanation && (
              <div className="tool-section" data-aos="fade-up">
                <h3>Gemini's Explanation</h3>
                <p>{jdExplanation}</p>
              </div>
            )}

            {masterDocID && jdContent && (
              <div className="tool-section" data-aos="fade-up">
                <ProfileExtractor
                  masterDocID={masterDocID}
                  jdText={jdContent}
                />
              </div>
            )}

            <button className="logout-btn" onClick={handleSignOutOnClick}>
              Log Out
            </button>
          </div>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
