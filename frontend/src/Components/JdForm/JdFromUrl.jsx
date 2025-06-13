import React, { useState } from "react";
// import { sendJobDescriptionUrl } from "../../services/jobDescriptionService";
import {
  explainJdUrl,
  extractJdSkillsUrl
} from "../../services/jobDescriptionService";


export default function JdFromUrl({ user, onExplanationReceived }) {
  const [jdUrl, setJdUrl] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [useLLM, setUseLLM] = useState(false);

  const handleSendJDUrl = async () => {
    if (!jdUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    setIsLoadingUrl(true);
    const idToken = await user.getIdToken();

    try {
      // Scrape URL and explain
      const { explanation } = await explainJdUrl(jdUrl, idToken);  // Note: this was changed from sendJobDescriptionUrl to separate JD scrape and explanation behavior

      // Then extract skills
      const skills = await extractJdSkillsUrl(jdUrl, idToken, useLLM);

      // Send the explantion and extracted skills back to the Homepage
      onExplanationReceived(explanation, skills); // pass explanation and extracted skills back to parent

      // console.log("Scraped content:", res.jd_content);
      setJdUrl(""); // clear the URL input after successful submission
    } catch (err) {
      console.log("Error sending URL", err);
      alert(
        "Error fetching or processing the job description. Please try to copy/paste the job description instead."
      );
    } finally {
      setIsLoadingUrl(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSendJDUrl();
      }}
      className="jd-form"
    >
      <h3>Enter Job Posting URL</h3>
      <div style={{ display: "inline-block", marginRight: "10px" }}>
        <label>
          <input
            type="checkbox"
            checked={useLLM}
            onChange={(e) => setUseLLM(e.target.checked)}
          />{" "}
          Use LLM extractor
        </label>
      </div>
      <input
        type="url"
        value={jdUrl}
        onChange={(e) => setJdUrl(e.target.value)}
        placeholder="https://example.com/job-posting"
        style={{ width: "400px", padding: "8px", marginRight: "10px" }}
      />
      <button type="submit" disabled={isLoadingUrl}>
        {isLoadingUrl ? "Scraping..." : "Get JD from URL"}
      </button>
    </form>
  );
}