import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
// import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
// import { MdClear } from "react-icons/md";
import { auth } from "../../firebase";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";  // PDF generation from text

import Sidebar from "../Sidebar/Sidebar";
import { handleSignout } from "../../services/authHandlers";
import JdFromUrl from "../JdForm/JdFromUrl";
import JdFromText from "../JdForm/JdFromText";
import UploadPdf from "../UploadPdf/UploadPdf";
import ResumeLibrary from "../ResumeLibrary/ResumeLibrary";
import ProfileExtractor from "../ProfileExtractor/ProfileExtractor";
import { usePdf } from "../PdfContext";
import { getSelectedKeywords } from "../../services/keywordService";
import { generateTargetedResume, saveGeneratedResume, getSimilarityScore } from "../../services/resumeService";

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
  // const [headerActive, setHeaderActive] = useState(false);  // TODO Might not need this

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

  // TODO: Figure out what this was used for (maybe as Reza?)
  // //if it works clean the error
  // const handleExplanationReceived = (explanation, skills) => {
  //   setJdExplanation(explanation);
  //   // clear error if successful 
  //   setUrlError("");
  //   setHighlightTextInput(false);
  //   // You can handle skills here if needed, or just ignore the parameter
  // };

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  // function for handling the errors 
  const handleUrlError = (errorMessage) => {
    setUrlError(errorMessage);
    setHighlightTextInput(true);
    setJdExplanation("");

    // stop after 5 seconds 
    setTimeout(() => {
      setHighlightTextInput(false);
    }, 5000); // 5000ms = 5 seconds
  };

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    try {
      const keywords = await getSelectedKeywords();
      const gen = await generateTargetedResume(masterDocID, jdContent, keywords);
      setGeneratedResume(gen);
      try {
        const { generated_score } = await getSimilarityScore(
          masterDocID,
          jdContent,
          gen
        );
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
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const lines = doc.splitTextToSize(generatedResume, 540);
    doc.text(lines, 36, 40);
    doc.save("Tailored_Resume.pdf");
  };

  const handleSaveToLibrary = async () => {
    try {
      await saveGeneratedResume(generatedResume, "Tailored_Resume.pdf");
      await fetchPdfsAndMaster();
      alert("Saved to your library!");
    } catch (e) {
      console.error(e);
      alert("Failed to save generated resume.");
    }
  };

  const handleTextInputFocus = () => {
    setUrlError("");
    setHighlightTextInput(false);
  };

  const handleExplanationReceived = (exp, rawText) => {
    setJdExplanation(exp);
    setJdContent(rawText);
  };

  const handleSignOutOnClick = async () => {
    try {
      await handleSignout();
      navigate("/", { replace: true });
    } catch (err) {
      console.log("Sign Out Error", err);
    }
  };


  return (
    <>
      <div className="tailor-container">
        {user ? (
          <>
            <div>
            {user && <Sidebar user={user} />}
            </div>

            <div className="outsidepdf-box"> Upload Your Resume
              <div className="uploadpdf-box"><UploadPdf /></div>
            </div>
            
            <div><ResumeLibrary /></div>

            <JdFromUrl 
              user={user} 
              onExplanationReceived={handleExplanationReceived}
              onError={handleUrlError}
            />

            
            {urlError && (
                <div className="url-error-message">
              {urlError}
              </div>
            )}

            <div style={{ margin: '20px 0', textAlign: 'center' }}>
              <strong>--- OR ---</strong>
            </div>

            <div className={highlightTextInput ? 'text-input-highlight' : ''}>

            <JdFromText 
              user={user} 
              onExplanationReceived={handleExplanationReceived}
              onFocus={handleTextInputFocus}
            />
            </div>

          {jdExplanation && (
            <div className="tool-section" data-aos="fade-up">
              <h3>Gemini's Explanation</h3>
              <p>{jdExplanation}</p>
            </div>
          )}

            {/* {jdExplanation && (
              <div className="jd-explanation">
                <h3>Gemini's Explanation</h3>
                <p>{jdExplanation}</p>
              </div>
            )} */}

            {/* Calculate and show similarity between master resume and JD */}
            {initialSim != null && (
              <div className="tool-section" data-aos="fade-up">
                <strong>Master Resume vs Job Description Similarity:</strong> {initialSim}%
              </div>
            )}

            {/* Extract Resume/JD profiles */}
            {masterDocID && jdContent && (
              <div className="tool-section" data-aos="fade-up">
                <ProfileExtractor masterDocID={masterDocID} jdText={jdContent} />
              </div>
            )}

            {/* If a master resume is set and a job description has been entered, render "Generate Tailored Resume" button*/}
            {masterDocID && jdContent && (
              <div className="tool-section" data-aos="fade-up">
                <button onClick={handleGenerateResume} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Tailored Resume"}
                </button>
              </div>
            )}

            {/* Once a tailored resume has been generated, display generated text in a text edit box */}
            {generatedResume && (
              <div className="tool-section" data-aos="fade-up">
                <h3>Your Tailored RezuMe</h3>
                <textarea
                  rows={15}
                  cols={80}
                  value={generatedResume}
                  onChange={e => setGeneratedResume(e.target.value)}
                />
                <br />

                <button onClick={handleDownloadText}>Download as Text</button>

                <button style={{ marginLeft: 8 }} onClick={handleDownloadPdf}>Download as PDF</button>

                <button style={{ marginLeft: 8 }} onClick={handleSaveToLibrary}>Save to Library</button>

                {/* Display Targeted Resume vs JD similarity */}
                {postGenSim != null && (
                  <div style={{ marginTop: 12 }}><strong>Generated RezuMe vs Job Description Similarity:</strong> {postGenSim}% </div>
                )}

              </div>
            )}

            <button className="logout-btn" onClick={handleSignOutOnClick}>Log Out</button>
            
          </>
        ) : (
          <p>Loading user...</p>
        )}
      </div>
    </>
  );
}