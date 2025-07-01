import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { auth } from "../../../firebase";
import Sidebar from "../../Sidebar/Sidebar";
import ProfileExtractor from "../ProfileExtractor/ProfileExtractor";
import { usePdf } from "../../PdfContext";
import { useTargetedResume } from "../../TargetedResumeContext";

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
                <h1 className="welcome-title" 
                style={{ marginBottom: "1.75rem" }}>Select Keywords</h1> {/*you can adjust to make the space between title and box smaller or bigger*/}

                <div
                    style={{
                    background: "white",
                    padding: "1rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    maxWidth: "900px",
                    margin: "0 auto",
                    fontSize: "1rem",
                    color: "#333",
                    lineHeight: "1.6",
                    textAlign: "left",
                    }}
                >
                    <ul
                        style={{
                            listStylePosition: "inside",
                            paddingLeft: "0",
                            margin: "0",
                            lineHeight: "1.5",
                        }}
                    >
                        <li>
                            <strong>Select keywords</strong> to include in your tailored resume to increase its relevance to the job description.
                        </li>
                        <li>
                            <strong>Skills highlighted in yellow</strong> are ones that match between your resume and the job description.
                        </li>
                        </ul>
                </div>
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
