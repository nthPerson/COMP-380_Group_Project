import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

import { auth } from "../../firebase";
import Sidebar from "../Sidebar/Sidebar";
import TinyDiffEditor from "../TinyDiffEditor/TinyDiffEditor";
import { usePdf } from "../PdfContext";
import { useTargetedResume } from "../TargetedResumeContext";
import { getSelectedKeywords } from "../../services/keywordService";
import {
  getSimilarityScore,
  generateTargetedResumeHtml,
  saveGeneratedResumePdf,
  fetchMasterText
} from "../../services/resumeService";
import { resumeTextToHtml } from "../../utils/resumeHtmlFormatter";
import { toDiffHtml } from "../../utils/diffHtml";

import "../TailorResume/TailorResume.css";
import "../Sidebar/Sidebar.css";

export default function GenerateAndEditResume() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { masterDocID, fetchPdfsAndMaster } = usePdf();
    const { jdContent, generatedHtml, setGeneratedHtml } = useTargetedResume();

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResume, setGeneratedResume] = useState("");
    const [initialSim, setInitialSim] = useState(null);
    const [postGenSim, setPostGenSim] = useState(null);
    const [masterText, setMasterText] = useState("");
    const [diffHtml, setDiffHtml] = useState("");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!masterDocID || !jdContent) return;
        getSimilarityScore(masterDocID, jdContent).then(({ master_score }) => setInitialSim(master_score)).catch(console.error);
    }, [masterDocID, jdContent]);
    

    useEffect(() => {
        if (!masterDocID) return;
            fetchMasterText(masterDocID).then(setMasterText).catch(console.error);
    }, [masterDocID]);

    useEffect(() => {
        if (!masterText || !generatedHtml) return;
        const masterHtml = resumeTextToHtml(masterText).trim().replace(/>\s+</g, "><");
        const htmlDiff = toDiffHtml(masterHtml, generatedHtml);
        setDiffHtml(htmlDiff);
    }, [masterText, generatedHtml]);

    const handleGenerateResume = async () => {
        setIsGenerating(true);
        try {
            const keywords = await getSelectedKeywords();
            const rawHtml = await generateTargetedResumeHtml(masterDocID, jdContent, keywords);
            const cleaned = rawHtml.trim().replace(/>\s+</g, "><");
            setGeneratedHtml(cleaned);

            const tmp = document.createElement("div");
            tmp.innerHTML = cleaned;
            const plainText = tmp.innerText;
            setGeneratedResume(plainText);

            const { generated_score } = await getSimilarityScore(masterDocID, jdContent, plainText);
            setPostGenSim(generated_score);
        } catch (err) {
            console.error(err);
            alert("Failed to generate resume. :(");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPdf = () => {
        const pdf = new jsPDF({ unit: "pt", format: "letter" });
        const wrapper = document.createElement("div");
        wrapper.style.width = "612px";
        wrapper.innerHTML = generatedHtml;
        pdf.html(wrapper, {
            callback: () => pdf.save("Tailored_Resume.pdf"),
            margin: [36,36,36,36],
            autoPaging: true,
            html2canvas: { scale: 0.8 }
        });
    };

    const handleDownloadText = () => {
        const blob = new Blob([generatedResume], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Tailored_Resume.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveToLibrary = async () => {
        try {
            const pdf = new jsPDF({ unit: "pt", format: "letter" });
            const wrapper = document.createElement("div");
            wrapper.style.width = "612px";
            wrapper.innerHTML = generatedHtml;
            await pdf.html(wrapper, { margin:[36,36,36,36], autoPaging:true, html2canvas:{scale:0.8} });
            const blob = pdf.output("blob");
            const form = new FormData();
            form.append("file", blob, "Tailored_Resume.pdf");
            await saveGeneratedResumePdf(form);
            await fetchPdfsAndMaster();
            alert("Saved RezuMe to your library!");
        } catch (e) {
            console.error(e);
            alert("Failed to save generated RezuMe :(");
        }
    };

    const getDifference = () => {
        if (initialSim == null || postGenSim == null) return null;
        return postGenSim - initialSim;
    };

    const handleSignOut = async () => {
        await auth.signOut();
        navigate("/", { replace: true });
    }

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
            <h1 className="welcome-title">Generate &amp; Edit Resume</h1>
            </header>

            {masterDocID && jdContent && (
            <div className="tool-section" data-aos="fade-up">
                <button onClick={handleGenerateResume} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Targeted Resume"}
                </button>
            </div>
            )}

            {generatedHtml && (
            <div className="tool-section" data-aos="fade-up">
                <h3>Resume Changes Highlighted</h3>
                <div className="diff-container" dangerouslySetInnerHTML={{ __html: diffHtml }} />
            </div>
            )}

            {generatedHtml && (
            <div className="tool-section" data-aos="fade-up">
                <h3>Edit Your Final Resume</h3>
                <TinyDiffEditor value={generatedHtml} onEditorChange={setGeneratedHtml} />
                <button onClick={handleDownloadText}>Download as Text</button>
                <button onClick={handleDownloadPdf}>Download as PDF</button>
                <button style={{ marginLeft: 8 }} onClick={handleSaveToLibrary}>Save to Library</button>
                {postGenSim != null && (
                <div style={{ marginTop: 12 }}>
                    <strong>Generated RezuMe vs Job Description Similarity:</strong> {postGenSim}%
                    {getDifference() != null && (
                    <div style={{ color: getDifference() > 0 ? "green" : "black", marginTop: 4 }}>
                        {getDifference() > 0 ? "Percentage Improvement: " : "Percentage Difference: "}
                        <strong>{Math.abs(getDifference()).toFixed(1)}%</strong>
                    </div>
                    )}
                </div>
                )}
            </div>
            )}

            <div className="logout-container">
            <button className="logout-btn" onClick={handleSignOut}>Log Out</button>
            </div>
        </main>
        </div>
    );

}

