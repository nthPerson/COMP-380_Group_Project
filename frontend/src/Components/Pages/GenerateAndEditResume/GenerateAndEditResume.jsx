import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { Link } from "react-router-dom";
import bunnyVideo from '../../Assets/RezuMe_Bunny_Mascot.mp4';

import { auth } from "../../../firebase";
import Sidebar from "../../Sidebar/Sidebar";
import TinyDiffEditor from "../../Helpers/TinyDiffEditor/TinyDiffEditor";
import { usePdf } from "../../PdfContext";
import { useTargetedResume } from "../../TargetedResumeContext";
import { getSelectedKeywords } from "../../../services/keywordService";
import {
    getSimilarityScore,
    generateTargetedResumeHtml,
    saveGeneratedResumePdf,
    fetchMasterText
} from "../../../services/resumeService";
import { resumeTextToHtml } from "../../../utils/resumeHtmlFormatter";
import { toDiffHtml } from "../../../utils/diffHtml";

import InfoBox from "../../UI/InfoBox/InfoBox";
import NavigationButton from "../../UI/NavigationButton/NavigationButton";
import GenerateButton from "../../UI/GenerateButton/GenerateButton";
import WarningBox from "../../UI/WarningBox/WarningBox";


import "../../Sidebar/Sidebar.css";
import "../TailorResume/TailorResume.css";
import "../UserProfile/UserProfile.css";
import "./GenerateAndEditResume.css"; // Add this line

export default function GenerateAndEditResume() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { masterDocID, pdfs, fetchPdfsAndMaster } = usePdf();
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

        // Get the master resume file name for naming tailored resumes
        const masterPdf = pdfs?.find(pdf => pdf.docID === masterDocID); // 🟢
        const masterName = masterPdf?.fileName?.replace(/\.pdf$/i, '').replace(/\.txt$/i, '') || "Resume"; // 🟢
        const tailoredPdfName = `Tailored_${masterName}.pdf`; 
        const tailoredTxtName = `Tailored_${masterName}.txt`; 
        //determine if the generation button should pulse or not
        // only pulse when...
        //  • not currently generating
        //  • you’ve never generated yet
        //  • AND you _have_ a JD (so no warning) so button does not pulse if the warning sign is up
        const shouldPulse = !isGenerating && !generatedHtml && Boolean(jdContent);


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
            callback: () => pdf.save(tailoredPdfName),
            margin: [36, 36, 36, 36],
            autoPaging: true,
            html2canvas: { scale: 0.8 }
        });
    };

    const handleDownloadText = () => {
        const blob = new Blob([generatedResume], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = tailoredTxtName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleSaveToLibrary = async () => {
        try {
            const pdf = new jsPDF({ unit: "pt", format: "letter" });
            const wrapper = document.createElement("div");
            wrapper.style.width = "612px";
            wrapper.innerHTML = generatedHtml;
            await pdf.html(wrapper, { margin: [36, 36, 36, 36], autoPaging: true, html2canvas: { scale: 0.8 } });
            const blob = pdf.output("blob");
            const form = new FormData();
            form.append("file", blob, tailoredPdfName);
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
                <span className="spinner" /> Loading...
            </p>
        );
    }

    return (
        <div className="layout">

            <Sidebar user={user} />

            <main className="tailor-container">
    <header className="header">
        <h1 className="welcome-title">Generate & Edit Resume</h1>
        
        {/* Centered bunny video under the title */}
        <div className="centered-bunny-container">
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="bunny-animation-centered"
            >
                <source src={bunnyVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
        
        {/* Instructions below the video */}
        <div className="instructions-only">
            <InfoBox
                items={[
                    <>
                        <strong>This resume</strong> will be customized to <strong>match the job description more closely</strong> by highlighting and incorporating the keywords you selected.
                    </>,
                    <>
                        After generation, you can <strong>edit the content</strong> to make it your own.
                    </>,
                    <>
                        You can <strong>save the final version to your library</strong> or <strong>download it to your computer</strong> as a text or PDF file.
                    </>
                ]}
            />
        </div>
    </header>

    <div className="tool-section" data-aos="fade-up" data-aos-delay="100">
         {!jdContent && masterDocID && <WarningBox>Please upload a job description before generating a RezuMe.</WarningBox>}

                    {masterDocID && (
                        <GenerateButton
                            onClick={handleGenerateResume}
                            disabled={!jdContent || isGenerating}
                            isGenerating={isGenerating}
                            pulse={shouldPulse}
                        />
                    )}

        {/*{generatedHtml && (
            <>
                <h3>Resume Changes Highlighted</h3>
                <div className="diff-container" dangerouslySetInnerHTML={{ __html: diffHtml }} />
            </>
        )} */}

        {generatedHtml && (
            <>
                <h3>Edit Your Final Resume</h3>
                <TinyDiffEditor value={generatedHtml} onEditorChange={setGeneratedHtml} />
                <div className="button-row" style={{ marginTop: '1rem' }}>
                    <button className="button" onClick={handleDownloadText}>Download as Text</button>
                    <button className="button" onClick={handleDownloadPdf}>Download as PDF</button>
                    <button className="button" style={{ marginLeft: 8 }} onClick={handleSaveToLibrary}>Save to Library</button>
                </div>
                {postGenSim != null && (
                    <div className="similarity-callout" style={{ marginTop: 12 }}>
                        <strong>Generated RezuMe vs Job Description Similarity:</strong> {postGenSim}%
                        {initialSim != null && (
                            <div style={{ marginTop: 4 }}>
                                Original Unaltered Resume vs Job Description Similarity: {initialSim}%
                            </div>
                        )}
                        {getDifference() != null && (
                            <div style={{ color: getDifference() > 0 ? "green" : "black", marginTop: 4 }}>
                                {getDifference() > 0 ? "Percentage Improvement: " : "Percentage Difference: "}
                                <strong>{Math.abs(getDifference()).toFixed(1)}%</strong>
                            </div>
                        )}
                    </div>
                )}
            </>
        )}
    </div>
    
    <div className="nav-buttons-row">
        <button type="button" className="navigation-button" onClick={() => navigate(-1)}>  &larr; Back </button>
        <NavigationButton to="/resumeArchive" disabled={!user}>
            That's It! Check Out All Your RezuMes!
        </NavigationButton>
    </div>
        </main>
        </div>
    );

}

