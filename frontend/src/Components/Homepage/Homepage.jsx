




/* 

THIS FILE HAS BEEN DEPRECATED. WE ARE CURRENTLY USING TailorResume.jsx FOR CORE APP BEHAVIOR

*/






import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

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

import "./Homepage.css";
import "../Sidebar/Sidebar.css";

export default function Homepage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jdExplanation, setJdExplanation] = useState("");
  const [jdContent, setJdContent] = useState("");
  const { masterDocID, fetchPdfsAndMaster } = usePdf();

  // Resume generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState("");

  // State for calculating similarity scores
  // const [simScores, setSimScores] = useState({ master_score: null, generated_score: null });
  const [initialSim, setInitialSim] = useState(null);  // Master Resume vs JD
  const [postGenSim, setPostGenSim] = useState(null);  // Generated Resume vs JD

  //   const handleExplanation = (exp, rawText) => {  // TODO: this function was suggested by GPT, but I haven't yet figured out what it's used for
  //   setJdExplanation(exp);
  //   setJdContent(rawText);
  // };

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

  const handleSignOutOnClick = async () => {
    try {
      await handleSignout();
      navigate("/", { replace: true });
    } catch (err) {
      console.log("Sign Out Error", err);
    }
  };

  return (
    <div className="homepage-layout">
      {user ? (
        <>
          <Sidebar user={user} />

          <div className="homepage-container">
            <div className="homepage-header" data-aos="fade-down">
              <h1 className="welcome-title">
                Welcome, {user.displayName || "User"} 👋
              </h1>
              <p className="welcome-subtext">
                You're logged in as <strong>{user.email}</strong>
              </p>
            </div>

            <div className="tool-section" data-aos="fade-up">
              <UploadPdf />
            </div>

            <div className="tool-section" data-aos="fade-up">
              <ResumeLibrary />
            </div>

            <div className="tool-section" data-aos="fade-up">
              <JdFromUrl
                user={user}
                onExplanationReceived={(exp, rawText) => {
                  setJdExplanation(exp);
                  setJdContent(rawText);
                }}
              />
            </div>

            <div className="divider">
              <strong>--- OR ---</strong>
            </div>

            <div className="tool-section" data-aos="fade-up">
              <JdFromText
                user={user}
                onExplanationReceived={(exp, rawText) => {
                  setJdExplanation(exp);
                  setJdContent(rawText);
                }}
              />
            </div>

            {jdExplanation && (
              <div className="tool-section" data-aos="fade-up">
                <h3>Gemini's Explanation</h3>
                <p>{jdExplanation}</p>
              </div>
            )}

            {masterDocID && jdContent && (
              <div className="tool-section" data-aos="fade-up">
                <ProfileExtractor
                  masterDocID={masterDocID}
                  jdText={jdContent}
                />
              </div>
            )}

            <button className="logout-btn" onClick={handleSignOutOnClick}>
              Log Out
            </button>
          </div>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
