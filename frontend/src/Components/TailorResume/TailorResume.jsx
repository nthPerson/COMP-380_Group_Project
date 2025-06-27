import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { jsPDF } from "jspdf";  // PDF generation from text or HTML

import { auth } from "../../firebase";
import Sidebar from "../Sidebar/Sidebar";
import { handleSignout } from "../../services/authHandlers";
import JdFromUrl from "../JdForm/JdFromUrl";
import JdFromText from "../JdForm/JdFromText";
import UploadPdf from "../UploadPdf/UploadPdf";
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";
import ProfileExtractor from "../ProfileExtractor/ProfileExtractor";
import { usePdf } from "../PdfContext";
import { getSelectedKeywords } from "../../services/keywordService";
import TinyDiffEditor from "../TinyDiffEditor/TinyDiffEditor";  
import { fetchMasterText } from "../../services/resumeService";
import { resumeTextToHtml } from "../../utils/resumeHtmlFormatter";  // Used for master resume <--> generated resume divv viewer
import { toDiffHtml } from "../../utils/diffHtml"
import { 
  generateTargetedResume, // Not currently using this plain text version
  generateTargetedResumeHtml, 
  saveGeneratedResumePdf, 
  getSimilarityScore } from "../../services/resumeService";

import AOS from "aos";
import "aos/dist/aos.css";
import "./TailorResume.css";
import "../Sidebar/Sidebar.css";


export default function TailorResume() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // local state to store the current Firebase user
  const [jdExplanation, setJdExplanation] = useState("");  // used for gemini explanation
  const [jdContent, setJdContent] = useState("");
  const { masterDocID, fetchPdfsAndMaster } = usePdf();
  const [isGenerating, setIsGenerating] = useState(false);  // Resume generation state
  const [generatedResume, setGeneratedResume] = useState("");  
  const [initialSim, setInitialSim] = useState(null);  // Master Resume vs JD similarity score
  const [postGenSim, setPostGenSim] = useState(null);  // Targeted Resume vs JD similarity scores
  const [masterText, setMasterText] = useState("");  // Used in the diff between master resume and targeted resume (to highlight changes)
  const [generatedHtml, setGeneratedHtml] = useState("");  // For targeted resume HTML returned by OpenAI API 
  const [diffHtml, setDiffHtml] = useState("");  // Used to hold the HTML for the {master resume} <--> {generated resume} diff viewr

  // State variables for the error handling
  const [urlError, setUrlError] = useState("");
  const [highlightTextInput, setHighlightTextInput] = useState(false);

  // As soon as we have a master resume set and a job decription, compute the similarity between Master and JD
  useEffect(() => {
    if (!masterDocID || !jdContent) return;
    getSimilarityScore(masterDocID, jdContent)
      .then(({ master_score }) => setInitialSim(master_score))
      .catch(console.error);
  }, [masterDocID, jdContent]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  // When a masterDocID is set (aka the user tags a master resume), load it's plain text
  useEffect(() => {
    if (!masterDocID) return;
    fetchMasterText(masterDocID)  // Get the text
        .then(setMasterText)  // Assign masterText with fetched text
        .catch(console.error);  // If shit goes down, handle it
  }, [masterDocID]);

  // Compute diff HTML between master resume and generated resume whenever they both become available 
  // (enables dynamic diff between master resume and text in resume editor window)
  useEffect(() => {
    if (!masterText || !generatedHtml) return;    
    const masterHtml = resumeTextToHtml(masterText).trim().replace(/>\s+</g, "><");
    const htmlDiff = toDiffHtml(masterHtml, generatedHtml);
    setDiffHtml(htmlDiff);
  }, [masterText, generatedHtml]);

  // function for handling the errors 
  const handleUrlError = (message) => {
    setUrlError(message);
    setHighlightTextInput(true);
    setJdExplanation("");
    setTimeout(() => setHighlightTextInput(false), 5000);
  };

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    try {
      const keywords = await getSelectedKeywords();
      const rawHtml = await generateTargetedResumeHtml(masterDocID, jdContent, keywords);
      const cleanedHtml = rawHtml.trim().replace(/>\s+</g, "><")
      // console.log("Generated Resume HTML: ", cleanedHtml);
      setGeneratedHtml(cleanedHtml);

      /** PLAIN TEXT VERSION OF THE RESUME GENERATION (uncomment the two lines below this comment,
       *  and comment out lines 98 and 99 to re-enable plain text version of resume generation) */ 
      // const gen = await generateTargetedResume(masterDocID, jdContent, keywords);
      // setGeneratedResume(gen);

      // Strip out all tags for plain-text for similarity calculation
      const tmp = document.createElement("div");
      tmp.innerHTML = cleanedHtml;
      const plainTextGeneratedResume = tmp.innerText;
      setGeneratedResume(plainTextGeneratedResume);

      try {
          const { generated_score } = await getSimilarityScore(masterDocID, jdContent, plainTextGeneratedResume);
          setPostGenSim(generated_score);
        } catch (e) {
          console.error("Post-gen similarity failed", e);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to generate resume. See console.");
      } finally {
        setIsGenerating(false);
      }
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
 
  const handleDownloadPdf = () => {
    const pdf = new jsPDF({ unit: "pt", format: "letter"});
    
    // Build temporary wrapper to get the most recent HTML from the resume editor
    const wrapper = document.createElement("div");
    wrapper.style.width = "612px";
    wrapper.innerHTML = generatedHtml;

    // Render resume HTML using jsPDF to create PDF of final resume
    pdf.html(wrapper, {
      callback: () => pdf.save("Tailored_Resume.pdf"),
      margin: [36,36,36,36],
      autoPaging: true,
      html2canvas: { scale: 0.8 }
    })    
  }; 

  const handleSaveToLibrary = async () => {
    try {
      // Generate PDF in-memory
      const pdf = new jsPDF({ unit: "pt", format: "letter" });
      const wrapper = document.createElement("div");
      wrapper.style.width = "612px";
      wrapper.innerHTML = generatedHtml;

      await pdf.html(wrapper, {
        margin:[36,36,36,36],
        autoPaging:true,
        html2canvas:{ scale:0.8 }
      });

      // Get PDF ready to send to backend for saving to resume library (aka save to Firebase Cloud Storage)
      const pdfBlob = pdf.output("blob");  // Get PDF bytes
      const form = new FormData();  // For container used to transport to backend
      form.append("file", pdfBlob, "Tailored_Resume.pdf");  // Pack the PDF and a filename into the form

      // Call service layer to send PDF to backend to save in Firebase Storage (or Cloud Storage or Firestore whatever that shit's called)
      await saveGeneratedResumePdf(form);

      // Refresh Resume Library so the new file will be shown
      await fetchPdfsAndMaster();
      alert("Saved RezuMe to your library!");
    } catch (e) {
      console.error(e);
      alert("Failed to save generated RezuMe :(");
    }
  };

  const clearErrorState = () => {
    setUrlError("");
    setHighlightTextInput(false);
  };

  const handleExplanationReceived = (exp, rawText) => {
    setJdExplanation(exp);
    setJdContent(rawText);
  };

  const handleSignOut = async () => {
    try {
      await handleSignout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Sign Out Error", err);
    }
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
      <aside className="sidebar">
        <Sidebar user={user} />
      </aside>
      <main className="tailor-container">
        <header className="header" data-aos="fade-down">
          <h1 className="welcome-title">
            Welcome, {user.displayName || "User"} 👋
          </h1>
          <p className="welcome-subtext">
            You're logged in as <strong>{user.email}</strong>
          </p>
        </header>

        <ToolSection title="Upload Resume" delay={100}>
          <p className="section-subtext">
            Start by uploading a PDF resume to tailor it to a job description.
          </p>
          <UploadPdf />
        </ToolSection>

        <ToolSection title="Resume Library" delay={200}>
          <p className="section-subtext">
            Access your saved resumes and manage document versions.
          </p>
          <ResumeLibrary />
        </ToolSection>

        <ToolSection title="Paste a Job Description (URL)" delay={300}>
          <p className="section-subtext">
            Paste a job post link and we'll extract relevant insights.
          </p>
          <JdFromUrl
            user={user}
            onExplanationReceived={handleExplanationReceived}
            onError={handleUrlError}
          />
          {urlError && <div className="url-error-message">{urlError}</div>}
        </ToolSection>

        <div className="divider">
          <strong>— OR —</strong>
        </div>

        <ToolSection
          title="Paste a Job Description (Text)"
          delay={400}
          extraClass={highlightTextInput ? "highlighted-section" : ""}
        >
          <p className="section-subtext">
            Prefer to copy-paste instead? Paste the text and get started
            instantly.
          </p>
          <JdFromText
            user={user}
            onExplanationReceived={handleExplanationReceived}
            onFocus={clearErrorState}
          />
        </ToolSection>

        {jdExplanation && (
          <ToolSection title="Gemini's Explanation" delay={500}>
            <p className="section-subtext">
              AI-generated insights from your uploaded job description.
            </p>
            <p>{jdExplanation}</p>
          </ToolSection>
        )}

        {/* Calculate and show similarity between master resume and JD */}
        {initialSim != null && (
          <div className="tool-section" data-aos="fade-up">
            <strong>Master Resume vs Job Description Similarity:</strong> {initialSim}%
          </div>
        )}

        {/* Extract Resume/JD profiles */}
        {masterDocID && jdContent && (
          <ToolSection title="Profile Extractor" delay={600}>
            <p className="section-subtext">
              Extract key info and tailor your resume for better alignment.
            </p>
            <ProfileExtractor masterDocID={masterDocID} jdText={jdContent} />
          </ToolSection>
        )}

        {/* If a master resume is set and a job description has been entered, render "Generate Tailored Resume" button*/}
        {masterDocID && jdContent && (
          <div className="tool-section" data-aos="fade-up">
            <button onClick={handleGenerateResume} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Tailored Resume"}
            </button>
          </div>
        )}

        {/* Master Resume -> Targeted RezuMe diff */}
        {generatedHtml && (
          <div className="tool-section" data-aos="fade-up">
             <h3>Resume Changes Highlighted</h3>
             <div className="diff-container" 
                dangerouslySetInnerHTML={{ __html: diffHtml }} 
              />
          </div>
        )}

        {/* Final RezuMe Editor */}
        {generatedHtml && (
          <div className="tool-section" data-aos="fade-up" >
             <h3>Edit Your Final Resume</h3>
             <TinyDiffEditor 
              value={generatedHtml}
              onEditorChange={setGeneratedHtml}
            />

            {/* PDF Download / Save buttons */}
            <button onClick={handleDownloadText}>Download as Text</button>
            <button style={{ marginLeft: 8 }} onClick={handleDownloadPdf}>Download as PDF</button>
            <button style={{ marginLeft: 8 }} onClick={handleSaveToLibrary}>Save to Library</button>

            {postGenSim != null && (
              <div style={{ marginTop: 12 }}>
                <strong>Generated Resume vs Job Description Similarity:</strong>{" "}
                {postGenSim}%
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