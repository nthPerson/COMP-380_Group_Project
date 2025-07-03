import React, { useState } from "react";
import { explainJdText, explainJdUrl } from "../../../services/jobDescriptionService";
import { usePdf } from "../../PdfContext";

export default function UnifiedJdInput({ user, onExplanationReceived, onFocus, onError }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { masterDocID } = usePdf();

  const isUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert("Please enter a job description or URL");
      return;
    }
    if (!masterDocID) {
      alert("Please set a master resume before submitting a job description.");
      return;
    }

    setIsLoading(true);
    try {
      const idToken = await user.getIdToken();
      let data;
      if (isUrl(input.trim())) {
        data = await explainJdUrl(input.trim(), idToken);
      } else {
        data = await explainJdText(input.trim(), idToken);
      }
      const { explanation, job_description } = data;
      onExplanationReceived(explanation, job_description);
      setInput("");
    } catch (err) {
      console.log("Error processing JD", err);
      if (isUrl(input.trim())) {
        if (onError) {
          onError("Failed to fetch job description from URL. Please try copying and pasting the text instead.");
        } else {
          alert("Error fetching or processing the job description. Please try to copy/paste the job description instead.");
        }
      } else {
        if (onError) {
          onError("Error processing job description. Please try again.");
        } else {
          alert("Error processing job description. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Enter a job description URL or paste the description in as text</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={onFocus}
        placeholder="Paste a job description or URL…"
        rows={6}
        cols={50}
      />
      <br />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Processing…" : "Submit"}
      </button>
    </form>
  );
}
