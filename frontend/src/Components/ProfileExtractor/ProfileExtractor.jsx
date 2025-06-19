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
} from "../../services/keywordService"

export default function ProfileExtractor ({masterDocID, jdText, jdUrl}) {
  const [resumeProfile, setResumeProfile] = useState(null);
  const [jdProfile, setJdProfile] = useState(null);
  const [loading, setLoading] = useState({ resume: false, jd: false });
  const [error,   setError] = useState(null);
  const [selected, setSelected] = useState([]);

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

    return (
    <div style={{ display: "flex", gap: 40, marginTop: 24 }}>
      <section style={{ flex: 1 }}>
        <h2>Job Description Profile</h2>
        {loading.jd && <p>Loading JD profile…</p>}
        {jdProfile && (
          <>
            <h3>Required Skills</h3>
            <ul>
              {jdProfile.required_skills.map((s) => (
                <li key={s}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.includes(s)}
                      onChange={e => toggleKeyword(s, e.target.checked)}
                    />{' '}
                    {s}
                  </label>
                </li>
              ))}
            </ul>
            <h3>Required Education</h3>
            <ul>
              {jdProfile.required_education.map((s) => (
                <li key={s}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.includes(s)}
                      onChange={e => toggleKeyword(s, e.target.checked)}
                    />{' '}
                    {s}
                  </label>
                </li>
              ))}
            </ul>
            <h3>Required Experience</h3>
            <ul>
              {jdProfile.required_experience.map((s) => (
                <li key={s}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.includes(s)}
                      onChange={e => toggleKeyword(s, e.target.checked)}
                    />{' '}
                    {s}
                  </label>
                </li>
              ))}
            </ul>
            <h3>Responsibilities</h3>
            <ul>
              {jdProfile.responsibilities.map((s) => (
                <li key={s}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.includes(s)}
                      onChange={e => toggleKeyword(s, e.target.checked)}
                    />{' '}
                    {s}
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      <section style={{ flex: 1 }}>
        <h2>Resume Profile</h2>
        {loading.resume && <p>Loading resume profile…</p>}
        {resumeProfile && (
          <>
            <h3>Skills</h3>
            <ul>
              {resumeProfile.skills.map((skill, i) => (
                <li key={`skill-${i}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.includes(skill)}
                      onChange={e => toggleKeyword(skill, e.target.checked)}
                    />{' '}
                    {skill}
                  </label>
                </li>
              ))}
            </ul>
            <h3>Education</h3>
            <ul>
              {resumeProfile.education.map((edu, i) => {
                const text = `${edu.degree} at ${edu.institution} (${edu.year})`;
                return (
                  <li key={`edu-${i}`}>
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
            <h3>Experience</h3>
            <ul>
              {resumeProfile.experience.map((exp, i) => {
                const text = `${exp.job_title} at ${exp.company} (${exp.dates})`;
                return (
                  <li key={`exp-${i}`}>
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
        )}
      </section>
    </div>
  );
}