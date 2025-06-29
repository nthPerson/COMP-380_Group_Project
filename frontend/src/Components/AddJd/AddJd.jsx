import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { auth } from "../../firebase";
import Sidebar from "../Sidebar/Sidebar";
import JdFromUrl from "../JdForm/JdFromUrl";
import JdFromText from "../JdForm/JdFromText";
import { usePdf } from "../PdfContext";
import { getSimilarityScore } from "../../services/resumeService";
import { useTargetedResume } from "../TargetedResumeContext";

import "../TailorResume/TailorResume.css";
import "../Sidebar/Sidebar.css";

export default function AddJd() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { masterDocID } = usePdf();
    const { jdExplanation, setJdExplanation, jdContent, setJdContent } = useTargetedResume();
    const [initialSim, setInitialSim] = useState(null);
    const [urlError, setUrlError] = useState("");
    const [highlightTextInput, setHighlightTextInput] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!masterDocID || !jdContent) return;
        getSimilarityScore(masterDocID, jdContent).then(({ master_score }) => setInitialSim(master_score)).catch(console.error);
    }, [masterDocID, jdContent]);

    const handleExplanationReceived = (exp, raw) => {
        setJdExplanation(exp);
        setJdContent(raw);
    };

    const handleUrlError = msg => {
        setUrlError(msg);
        setHighlightTextInput(true);
        setJdExplanation("");
        setTimeout(() => setHighlightTextInput(false), 5000);
    };

    const clearErrorState = () => {
        setUrlError("");
        setHighlightTextInput(false);
    };

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
            <h1 className="welcome-title">Add Job Description</h1>
            </header>

            <ToolSection title="Paste a Job Description (URL)" delay={100}>
            <JdFromUrl user={user} onExplanationReceived={handleExplanationReceived} onError={handleUrlError} />
            {urlError && <div className="url-error-message">{urlError}</div>}
            </ToolSection>

            <div className="divider"><strong>&mdash; OR &mdash;</strong></div>

            <ToolSection title="Paste a Job Description (Text)" delay={200} extraClass={highlightTextInput ? "highlighted-section" : ""}>
            <JdFromText user={user} onExplanationReceived={handleExplanationReceived} onFocus={clearErrorState} />
            </ToolSection>

            {jdExplanation && (
            <ToolSection title="Gemini's Explanation" delay={300}>
                <p>{jdExplanation}</p>
            </ToolSection>
            )}

            {initialSim != null && (
            <div className="tool-section" data-aos="fade-up">
                <strong>Master Resume vs Job Description Similarity:</strong> {initialSim}%
            </div>
            )}

            <Link to="/selectKeywords" className="get-started-btn">
              Next: Select Keywords to Emphasize!
            </Link>

            <div className="logout-container">
            <button className="logout-btn" onClick={handleSignOut}>Log Out</button>
            </div>
        </main>
        </div>
    );
    }

    function ToolSection({ title, delay = 0, extraClass = "", children }) {
    return (
        <section
        className={`tool-section ${extraClass}`.trim()}
        data-aos="fade-up"
        data-aos-delay={delay}
        data-aos-offset="120"
        >
        <h2>{title}</h2>
        {children}
        </section>
    );

}
