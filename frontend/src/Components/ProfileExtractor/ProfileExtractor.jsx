/*
Main UI for extracting resume and job description keywords
*/
import React, { useState, useEffect } from "react";
import { extractResumeProfileLLM } from "../../services/resumeService";
import { extractJdProfile } from "../../services/jobDescriptionService";
import { auth } from "../../firebase";

import {
  getSelectedKeywords,
  addSelectedKeywords,
  removeSelectedKeyword,
  // clearKeywords,   Current implementation does not use this, but clearing the keywords is possible
  fetchHighlights
} from "../../services/keywordService"

export default function ProfileExtractor ({masterDocID, jdText, jdUrl}) {
  const [resumeProfile, setResumeProfile] = useState(null);
  const [jdProfile, setJdProfile] = useState(null);
  const [loading, setLoading] = useState({ resume: false, jd: false });
  const [error,   setError] = useState(null);
  const [selected, setSelected] = useState([]);

  // Similarity highlighting masks
  const [matchedResume, setMatchedResume] = useState([]);
  const [matchedJd, setMatchedJd] = useState([]);

  // Fetch the resume profile (skills, education, professional experience) from master resume
  useEffect(() => {
    if (!masterDocID || !jdText) return;
    setLoading(l => ({ ...l, resume: true }));
    extractResumeProfileLLM(masterDocID)
        .then(profile => setResumeProfile(profile))
        .catch(err => setError(err.toString()))
        .finally(() => setLoading(l => ({ ...l, resume: false })));
  }, [masterDocID, jdText]);

  // Fetch the job description profile via the text-LLM extractor only
  useEffect(() => {
        if (!jdText) return;

        async function fetchJdProfile() {
            setLoading(l => ({ ...l, jd: true }));
            try {
                // Fetch Firebase ID token
                const idToken = await auth.currentUser.getIdToken();  // Get user's ID token to authenticate profile extraction calls to backend
                const profile = await extractJdProfile(jdText, idToken);  // Get the extracted profile (all keywords) from job description
                setJdProfile(profile);  // Send the extracted profile to the parent (Homepage)
            } catch (err) {
                setError(err.toString());
            } finally {
                setLoading(l => ({ ...l, jd: false }));
            }
        }
        fetchJdProfile();
  }, [jdText]);

  // Load any previously selected keywords for this session
  useEffect(() => {
    async function fetchSelected() {
      try {
        const keywords = await getSelectedKeywords();
        setSelected(keywords);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSelected();
  }, []);

    // Whenever both profiles arrive, fetch the similarity highlights mask
  useEffect(() => {
    if (!(resumeProfile && jdProfile)) return;

    // build flat lists of strings in the same order we will render them:
    const resumeItems = [
      ...resumeProfile.skills,
      ...resumeProfile.education.map(e => `${e.degree} at ${e.institution} (${e.year})`),
      ...resumeProfile.experience.map(x => `${x.job_title} at ${x.company} (${x.dates})`)
    ];

    const jdItems = [
      ...jdProfile.required_skills,
      ...jdProfile.required_education,
      ...jdProfile.required_experience,
      ...jdProfile.responsibilities
    ];

    fetchHighlights(resumeItems, jdItems)
      .then(({ matched_resume, matched_jd }) => {
        setMatchedResume(matched_resume);
        setMatchedJd(matched_jd);
      })
      .catch(console.error);
  }, [resumeProfile, jdProfile]);

  // Allows the user to toggle/select keywords
  const toggleKeyword = async (keyword, checked) => {
    setSelected(prev => {
      const exists = prev.includes(keyword);
      if (checked && !exists) return [...prev, keyword];
      if (!checked && exists) return prev.filter(k => k !== keyword);
      return prev;
    });

    try {
      if (checked) {
        await addSelectedKeywords([keyword]);
      } else {
        await removeSelectedKeyword(keyword);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  // helpers to pull out the right slice of matchedJd/matchedResume for each section
  const jdSectionMatches = (start, length) =>
    matchedJd.slice(start, start + length);

  const resumeSectionMatches = (start, length) =>
    matchedResume.slice(start, start + length);

  // compute offsets for slicing
  const rsLen = resumeProfile 
    ? resumeProfile.skills.length +
      resumeProfile.education.length +
      resumeProfile.experience.length
    : 0;
  const jsLen = jdProfile
    ? jdProfile.required_skills.length +
      jdProfile.required_education.length +
      jdProfile.required_experience.length +
      jdProfile.responsibilities.length
    : 0;

  return (
    <div style={{ display: "flex", gap: 40, marginTop: 24 }}>
      {/* ---- JD Side ---- */}
      <section style={{ flex: 1 }}>
        <h2>Job Description Profile</h2>
        {loading.jd && <p>Loading JD profile…</p>}
        {jdProfile && (
          <>
            {/*
              We'll keep a running offset through the jdItems:
                0..skillsLen-1 => skills
                skillsLen..+eduLen-1 => education
                etc…
            */}
            {(() => {
              let offset = 0;
              const { required_skills, required_education, required_experience, responsibilities } = jdProfile;

              return (
                <>
                  <h3>Required Skills</h3>
                  <ul>
                    {required_skills.map((s,i) => {
                      const match = jdSectionMatches(offset, required_skills.length)[i];
                      return (
                        <li 
                          key={s} 
                          style={{ backgroundColor: match ? "#ffffcc" : "transparent" }}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={selected.includes(s)}
                              onChange={e => toggleKeyword(s, e.target.checked)}
                            />{' '}
                            {s}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  {offset += required_skills.length}

                  <h3>Required Education</h3>
                  <ul>
                    {required_education.map((s,i) => {
                      const match = jdSectionMatches(offset, required_education.length)[i];
                      return (
                        <li 
                          key={s}
                          style={{ backgroundColor: match ? "#ffffcc" : "transparent" }}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={selected.includes(s)}
                              onChange={e => toggleKeyword(s, e.target.checked)}
                            />{' '}
                            {s}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  {offset += required_education.length}

                  <h3>Required Experience</h3>
                  <ul>
                    {required_experience.map((s,i) => {
                      const match = jdSectionMatches(offset, required_experience.length)[i];
                      return (
                        <li 
                          key={s}
                          style={{ backgroundColor: match ? "#ffffcc" : "transparent" }}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={selected.includes(s)}
                              onChange={e => toggleKeyword(s, e.target.checked)}
                            />{' '}
                            {s}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  {offset += required_experience.length}

                  <h3>Responsibilities</h3>
                  <ul>
                    {responsibilities.map((s,i) => {
                      const match = jdSectionMatches(offset, responsibilities.length)[i];
                      return (
                        <li 
                          key={s}
                          style={{ backgroundColor: match ? "#ffffcc" : "transparent" }}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={selected.includes(s)}
                              onChange={e => toggleKeyword(s, e.target.checked)}
                            />{' '}
                            {s}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </>
              );
            })()}
          </>
        )}
      </section>

      {/* —————— Resume Side —————— */}
      <section style={{ flex: 1 }}>
        <h2>Resume Profile</h2>
        {loading.resume && <p>Loading resume profile…</p>}
        {resumeProfile && (
          <>
            {(() => {
              let offset = 0;
              const { skills, education, experience } = resumeProfile;

              return (
                <>
                  <h3>Skills</h3>
                  <ul>
                    {skills.map((skill,i) => {
                      const match = resumeSectionMatches(offset, skills.length)[i];
                      return (
                        <li 
                          key={`skill-${i}`} 
                          style={{ backgroundColor: match ? "#ffffcc" : "transparent" }}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={selected.includes(skill)}
                              onChange={e => toggleKeyword(skill, e.target.checked)}
                            />{' '}
                            {skill}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  {offset += skills.length}

                  <h3>Education</h3>
                  <ul>
                    {education.map((ed,i) => {
                      const text = `${ed.degree} at ${ed.institution} (${ed.year})`;
                      const match = resumeSectionMatches(offset, education.length)[i];
                      return (
                        <li 
                          key={`edu-${i}`} 
                          style={{ backgroundColor: match ? "#ffffcc" : "transparent" }}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={selected.includes(text)}
                              onChange={e => toggleKeyword(text, e.target.checked)}
                            />{' '}
                            {text}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  {offset += education.length}

                  <h3>Experience</h3>
                  <ul>
                    {experience.map((exp,i) => {
                      const text = `${exp.job_title} at ${exp.company} (${exp.dates})`;
                      const match = resumeSectionMatches(offset, experience.length)[i];
                      return (
                        <li 
                          key={`exp-${i}`} 
                          style={{ backgroundColor: match ? "#ffffcc" : "transparent" }}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={selected.includes(text)}
                              onChange={e => toggleKeyword(text, e.target.checked)}
                            />{' '}
                            {text}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </>
              );
            })()}
          </>
        )}
      </section>
    </div>
  );
}