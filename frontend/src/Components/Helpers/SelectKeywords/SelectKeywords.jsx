import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import NavigationButton from "../../UI/NavigationButton/NavigationButton";

import { auth } from "../../../firebase";
import Sidebar from "../../Sidebar/Sidebar";
import ProfileExtractor from "../ProfileExtractor/ProfileExtractor";
import { usePdf } from "../../PdfContext";
import { useTargetedResume } from "../../TargetedResumeContext";

import InfoBox from "../../UI/InfoBox/InfoBox";
import WarningBox from "../../UI/WarningBox/WarningBox";

import "../../Sidebar/Sidebar.css";


export default function SelectKeywords() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { masterDocID } = usePdf();
  const { jdContent } = useTargetedResume();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/", { replace: true });
  };

  if (!user) {
    return (
      <p className="loading-text">
        <span className="spinner" /> Loading...
      </p>
    );
  }

  return (
    <div className="layout">
      
      <Sidebar user={user} />
      
      <main className="tailor-container">
        <header className="header">
          <h1 className="welcome-title" style={{ marginBottom: "1.75rem" }}>
            Select Keywords
          </h1>
          <InfoBox
            items={[
              <>
                <strong>Select keywords</strong> to include in your tailored resume to increase its relevance to the job description.
              </>,
              <>
                <strong>Skills highlighted in yellow</strong> are ones that match between your resume and the job description.
              </>
            ]}
          />
        </header>


        {/* ---- this is the only place WarningBox ever appears ---- */}
        {masterDocID && jdContent ? (
          <ProfileExtractor masterDocID={masterDocID} jdText={jdContent} />
        ) : (
          <WarningBox>
            Please upload a job description and select a master resume first.
          </WarningBox>

        )}

        <div className="nav-buttons-row">
          <button type="button" className="navigation-button" onClick={() => navigate(-1)} >  &larr; Back </button>
          <NavigationButton to="/generateEditResume" disabled={!(masterDocID && jdContent)}>
            Next: Generate and Edit Your RezuMe!
          </NavigationButton>
        </div>

        <div className="logout-container">
          <button className="logout-btn" onClick={handleSignOut}>Log Out</button>
        </div>
      </main>
    </div>
  );

}
