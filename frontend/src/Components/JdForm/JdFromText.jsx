import React, { useState } from "react";
// import { sendJobDescription } from "../../services/jobDescriptionService";
import { explainJdText } from "../../services/jobDescriptionService";


export default function JdFromText({ user, onExplanationReceived }) {
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [useLLM, setUseLLM] = useState(false);

    const handleSendJD = async () => {
    if (!jdText.trim()) {
      alert("Please enter a job description");
      return;
    }

    setIsLoading(true);
    
    try {
      const idToken = await user.getIdToken();      
      const { explanation, job_description } = await explainJdText(jdText, idToken); // Get Gemini explanation and raw JD tezt
      onExplanationReceived(explanation, job_description); // Push explanation and job description text back up to parent (Homepage)
      setJdText(""); // Clear the text area after successful submission
    } catch (err) {
      console.log("Error processing JD text", err);
      alert("Error processing job description. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={e => { e.preventDefault(); handleSendJD(); }}>
      <h3>Paste a Job Description</h3>
      <textarea
        value={jdText}
        onChange={e => setJdText(e.target.value)}
        placeholder="Enter job description here…"
        rows={6}
        cols={50}
      />
      <br/>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Processing…" : "Send JD"}
      </button>
    </form>
  );
}