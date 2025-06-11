import React, { useState, useEffect } from "react";
import { usePdf } from "../PdfContext";
import { extractResumeSkills } from "../../services/resumeService";

export default function SkillHighlighter({ jobSkills }) {
  const { masterDocID } = usePdf();
  const [resumeSkills, setResumeSkills] = useState([]);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    const loadResumeSkills = async () => {
      if (!masterDocID) {
        setResumeSkills([]);
        return;
      }
      setLoadingResume(true);
      try {
        const skills = await extractResumeSkills(masterDocID);
        setResumeSkills(skills);
      } catch {
        setResumeSkills([]);
      }
      setLoadingResume(false);
    };
    loadResumeSkills();
  }, [masterDocID]);

  return (
    <div style={{ margin: "20px 0", padding: "10px", border: "1px solid #ddd" }}>
      <h3>Job Description Skills:</h3>
      {jobSkills?.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {jobSkills.map((kw) => (
            <span
              key={kw}
              style={{
                background: "#eef",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: "0.9rem",
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      ) : (
        <p><em>No skills extracted from JD.</em></p>
      )}

      <h3 style={{ marginTop: 16 }}>Resume Skills:</h3>
      {loadingResume ? (
        <p>Loading resume skills…</p>
      ) : resumeSkills.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {resumeSkills.map((kw) => (
            <span
              key={kw}
              style={{
                background: "#efe",
                padding: "4px 8px",
                borderRadius: 4,
                fontSize: "0.9rem",
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      ) : (
        <p><em>No skills extracted from resume.</em></p>
      )}
    </div>
  );
}