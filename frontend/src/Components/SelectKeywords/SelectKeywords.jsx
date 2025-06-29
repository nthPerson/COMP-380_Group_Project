import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { auth } from "../../firebase";
import Sidebar from "../Sidebar/Sidebar";
import ProfileExtractor from "../ProfileExtractor/ProfileExtractor";
import { usePdf } from "../PdfContext";
import { useTargetedResume } from "../TargetedResumeContext";

import "../TailorResume/TailorResume.css";
import "../Sidebar/Sidebar.css";


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
                <span className="spinner"/> Loading...
            </p>
        );
    }

    return (
        <div className="layout">
        <aside className="sidebar">
            <Sidebar user={user} />
        </aside>
        <main className="tailor-container">
            <header className="header">
            <h1 className="welcome-title">Select Keywords</h1>
            </header>

            {masterDocID && jdContent ? (
            <ProfileExtractor masterDocID={masterDocID} jdText={jdContent} />
            ) : (
            <p>Please upload a job description and select a master resume first.</p>
            )}

            <Link to="/generateEditResume" className="get-started-btn">
              Next: Generate and Edit Your RezuMe!
            </Link>

            <div className="logout-container">
            <button className="logout-btn" onClick={handleSignOut}>Log Out</button>
            </div>
        </main>
        </div>
    );

}
