import React, { useState, useCallback } from "react";
import { usePdf } from "../PdfContext";
import { extractResumeSkills, extractResumeSkillsLLM } from "../../services/resumeService";

export default function SkillHighlighter({ jobSkills }) {
    const { masterDocID } = usePdf();
    const [resumeSkills, setResumeSkills] = useState([]);
    const [loadingResume, setLoadingResume] = useState(false);
    const [useLLM, setUseLLM] = useState(false);

  // Handler to fetch resume skills on demand
    const loadResumeSkills = useCallback(async () => {
      if (!masterDocID) return;
      setLoadingResume(true);
      try {
          const skills = useLLM
            ? await extractResumeSkillsLLM(masterDocID)
            : await extractResumeSkills(masterDocID);
          setResumeSkills(skills);
      } catch {
          setResumeSkills([]);
      }
      setLoadingResume(false);
    }, [masterDocID, useLLM]);
 

    return (
    <div style={{ border:"1px solid #ddd", padding:12, margin:"20px 0" }}>
      {/* JD skills (unchanged) */}
      <h3>Job Description Skills</h3>
      {jobSkills.length ? jobSkills.join(" · ") : <em>none</em>}

      {/* ==== Toggle & action ==== */}
      <h3 style={{marginTop:20}}>Resume Skills</h3>
      <label style={{marginRight:12}}>
        <input
          type="checkbox"
          checked={useLLM}
          onChange={e => setUseLLM(e.target.checked)}
        />{" "}
        Use LLM extractor
      </label>
      { masterDocID &&
        <button onClick={loadResumeSkills} disabled={loadingResume}>
          {loadingResume ? "Extracting…" : "Extract Resume Skills"}
        </button>
      }

      <div style={{marginTop:10}}>
        {loadingResume
          ? "Loading…"
          : resumeSkills.length
              ? resumeSkills.join(" · ")
              : <em>No skills extracted.</em>}
      </div>
    </div>
  );
}


