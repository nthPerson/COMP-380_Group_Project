import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../../firebase";
import Sidebar from "../../Sidebar/Sidebar";
import UnifiedJdInput from "../../Helpers/JdForm/UnifiedJdInput";
import { usePdf } from "../../PdfContext";
import { getSimilarityScore } from "../../../services/resumeService";
import { useTargetedResume } from "../../TargetedResumeContext";
import InfoBox from "../../UI/InfoBox/InfoBox";
import NavigationButton from "../../UI/NavigationButton/NavigationButton";

import "../../Sidebar/Sidebar.css";
import "../TailorResume/TailorResume.css";


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
                <span className="spinner" /> Loading...
            </p>
        );
    }

    return (
        <div className="layout">

            <Sidebar user={user} />

            <main className="tailor-container">
                <header className="header">
                    <h1 className="welcome-title" style={{ marginBottom: "0.5rem" }}>
                        Add Job Description
                    </h1>
                    <InfoBox
                        items={[
                            <>
                                <strong>Paste a job description</strong> so the system can extract required skills, qualifications, and responsibilities.
                            </>,
                            <>
                                Use either a URL <strong>or</strong> the full job posting text — whatever you prefer.
                            </>
                        ]}
                    />
                </header>

                <ToolSection title="Paste a Job Description" delay={100} extraClass={highlightTextInput ? "highlighted-section" : ""}>
                    <UnifiedJdInput
                        user={user}
                        onExplanationReceived={handleExplanationReceived}
                        onError={handleUrlError}
                        onFocus={clearErrorState}
                    />
                    {urlError && <div className="url-error-message">{urlError}</div>}

                    {jdExplanation && (
                        <>
                            <h2>Job Description Summary</h2>
                            <p>{jdExplanation}</p>
                        </>
                    )}

                    {initialSim != null && (
                        <p className="similarity-callout">
                            <strong>Master Resume vs Job Description Similarity:</strong> <span style={{
                                display: 'block',
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                textAlign: "center",
                                color: "#1a73e8",
                                marginTop: '0.25rem'
                            }}>{initialSim}%</span>
                        </p>
                    )}
                </ToolSection>

                <div className="nav-buttons-row">
                    <button type="button" className="navigation-button" onClick={() => navigate(-1)} >  &larr; Back </button>
                    <NavigationButton to="/selectKeywords" disabled={!(masterDocID && jdContent)}>
                        Next: Select Keywords to Emphasize!
                    </NavigationButton>
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
