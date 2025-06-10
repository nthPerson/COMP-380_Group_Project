import React, { useState } from "react";
import { sendJobDescriptionUrl } from "../../services/jobDescriptionService";


export default function JdFromUrl({ user, onExplanationReceived }) {
  const [jdUrl, setJdUrl] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const handleSendJDUrl = async () => {
    if (!jdUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    const idToken = await user.getIdToken();
    setIsLoadingUrl(true);

    try {
      const res = await sendJobDescriptionUrl(jdUrl, idToken);
      const explanation = res.explanation || "No explanation returned";
      onExplanationReceived(explanation); // pass explanation back to parent
      console.log("Scraped content:", res.jd_content);
      setJdUrl(""); // clear the URL input after successful submission
    } catch (err) {
      console.log("Error sending URL", err);
      alert(
        "Error scraping job description from URL. Please try copying and pasting the job description instead."
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