import React, { useState } from "react";
import { explainJdUrl } from "../../services/jobDescriptionService";
import { usePdf } from "../PdfContext";


export default function JdFromUrl({ user, onExplanationReceived, onError }) {

  const [jdUrl, setJdUrl] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const { masterDocID } = usePdf();

    const handleSendJDUrl = async () => {
    if (!jdUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    // Make sure that the user has a master resume set before handling their job description (once 
    // the JD is entered, the JD and resume profile extraction is automatic so the master resume needs to be set)
    if (!masterDocID) {
      alert("Please set a master resume before submitting a job description.");
      return;
    }

    setIsLoadingUrl(true);
    
    try {
      const idToken = await user.getIdToken();      
      const { explanation, job_description } = await explainJdUrl(jdUrl, idToken); // Fetch scraped JD and explanation
      onExplanationReceived(explanation, job_description); // pass explanation and extracted skills back to parent
      setJdUrl(""); // clear the URL input after successful submission
    } catch (err) {
    console.log("Error sending URL", err);
    // Call the error handler passed from parent instead of alert
    if (onError) {
      onError("Failed to fetch job description from URL. Please try copying and pasting the text instead.");
    } else {
      // Fallback to alert 
      alert(
      "Error fetching or processing the job description. Please try to copy/paste the job description instead."
    );
    }
    } finally {
      setIsLoadingUrl(false);
    }
  };

    return (
    <form onSubmit={e => { e.preventDefault(); handleSendJDUrl(); }}>
      <h3>Enter Job Posting URL</h3>
      <input
        type="url"
        value={jdUrl}
        onChange={e => setJdUrl(e.target.value)}
        placeholder="https://…"
        style={{ width: 400, padding: 8, marginRight: 10 }}
      />
      <button type="submit" disabled={isLoadingUrl}>
        {isLoadingUrl ? "Fetching…" : "Get JD from URL"}
      </button>
    </form>
  );
}