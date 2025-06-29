import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase";
import Sidebar from "../Sidebar/Sidebar";
import UploadPdf from "../UploadPdf/UploadPdf";
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";
import { usePdf } from "../PdfContext";

import "../TailorResume/TailorResume.css";
import "../Sidebar/Sidebar.css";

export default function UploadResume() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { fetchPdfsAndMaster } = usePdf();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, u => setUser(u));
        return () => unsub();
    }, []);

    // Refresh list on first visit
    useEffect(() => { fetchPdfsAndMaster(); }, [fetchPdfsAndMaster]);

    const handleSignOut = async () => {
        await auth.signOut();
        navigate("/", { replace: true });
    };

    if (!user) {
        return (
            <p className="loading-text"> 
                <span className="spinner"/> Loading...
            </p>
            
        )
    };

    return (
        <div className="layout">
        <aside className="sidebar">
            <Sidebar user={user} />
        </aside>
        <main className="tailor-container">
            <header className="header">
            <h1 className="welcome-title">Upload Resume</h1>
            <p className="welcome-subtext">
                You're logged in as <strong>{user.email}</strong>
            </p>
            </header>

            <div className="tool-section" data-aos="fade-up">
            <UploadPdf />
            </div>

            <div className="tool-section" data-aos="fade-up">
            <ResumeLibrary showGenerated={false} showUploaded={true} />
            </div>

            <div className="logout-container">
            <button className="logout-btn" onClick={handleSignOut}>Log Out</button>
            </div>
        </main>
        </div>
    );

}

