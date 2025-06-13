import React, { useState } from "react";
// import { sendJobDescription } from "../../services/jobDescriptionService";

import {
  explainJdText,
  extractJdSkillsText
} from "../../services/jobDescriptionService";

export default function JdFromText({ user, onExplanationReceived }) {
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useLLM, setUseLLM] = useState(false);

  const handleSendJD = async () => {
    if (!jdText.trim()) {
      alert("Please enter a job description");
      return;
    }

    setIsLoading(true);
    const idToken = await user.getIdToken();

    try {
      // Just get the Gemini explanation (JD handling and keyword extraction behavior is separated now)
      const { explanation } = await explainJdText(jdText, idToken); // Note: this was changed from sendJobDescription(jdText, idToken) to isolate JD handling and extraction behavior

      // Then extract the skills using toggle (Local NLP / LLM)
      const skills = await extractJdSkillsText(jdText, idToken, useLLM);

      // Send the explantion and extracted skills back to the Homepage
      onExplanationReceived(explanation, skills); // Pass explanation and extracted skills back to parent

      setJdText(""); // Clear the text area after successful submission
    } catch (err) {
      console.log("Error sending JD or extracting keywords", err);
      alert("Error processing job description. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSendJD();
      }}
      className="jd-form"
    >
      <h3>Paste a Job Description</h3>

      <div style={{ margin: "10px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={useLLM}
            onChange={(e) => setUseLLM(e.target.checked)}
          />{" "}
          Use LLM extractor
        </label>
      </div>  

      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        placeholder="Enter job description here..."
        rows={6}
        cols={50}
      />    
      <br />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : "Send JD"}
      </button>
    </form>
  );
}