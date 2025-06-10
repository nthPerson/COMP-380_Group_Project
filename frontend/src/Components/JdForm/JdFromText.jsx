import React, { useState } from "react";
import { sendJobDescription } from "../../services/jobDescriptionService";

export default function JdFromText({ user, onExplanationReceived }) {
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendJD = async () => {
    if (!jdText.trim()) {
      alert("Please enter a job description");
      return;
    }

    const idToken = await user.getIdToken();
    setIsLoading(true);

    try {
      const res = await sendJobDescription(jdText, idToken);
      const explanation = res.explanation || "No explanation returned";
      onExplanationReceived(explanation); // Pass explanation back to parent
      setJdText(""); // Clear the text area after successful submission
    } catch (err) {
      console.log("Error sending JD", err);
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