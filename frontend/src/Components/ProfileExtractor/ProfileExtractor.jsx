/*
Main UI for extracting resume and job description keywords
*/
import React, { useState, useEffect } from "react";
import { extractResumeProfileLLM } from "../../services/resumeService";
import { extractJdProfile } from "../../services/jobDescriptionService";
import { auth } from "../../firebase";

export default function ProfileExtractor({ masterDocID, jdText, jdUrl }) {
  const [resumeProfile, setResumeProfile] = useState(null);
  const [jdProfile, setJdProfile] = useState(null);
  const [loading, setLoading] = useState({ resume: false, jd: false });
  const [error, setError] = useState(null);

  // Fetch the resume profile (skills, education, professional experience + projects) from master resume
  useEffect(() => {
    if (!masterDocID || !jdText) return;
    setLoading((l) => ({ ...l, resume: true }));
    extractResumeProfileLLM(masterDocID)
      .then((profile) => setResumeProfile(profile))
      .catch((err) => setError(err.toString()))
      .finally(() => setLoading((l) => ({ ...l, resume: false })));
  }, [masterDocID, jdText]);

  // Fetch the job description profile via the text-LLM extractor only
  useEffect(() => {
    if (!jdText) return;

    async function fetchJdProfile() {
      setLoading((l) => ({ ...l, jd: true }));
      try {
        // Fetch Firebase ID token
        const idToken = await auth.currentUser.getIdToken(); // Get user's ID token to authenticate profile extraction calls to backend
        const profile = await extractJdProfile(jdText, idToken); // Get the extracted profile (all keywords) from job description
        setJdProfile(profile); // Send the extracted profile to the parent (Homepage)
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading((l) => ({ ...l, jd: false }));
      }
    }

    fetchJdProfile();
  }, [jdText]);

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
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h3>Required Education</h3>
            <ul>
              {jdProfile.required_education.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h3>Required Experience</h3>
            <ul>
              {jdProfile.required_experience.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h3>Responsibilities</h3>
            <ul>
              {jdProfile.responsibilities.map((s) => (
                <li key={s}>{s}</li>
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
                <li key={`skill-${i}`}>{skill}</li>
              ))}
            </ul>

            <h3>Education</h3>
            <ul>
              {resumeProfile.education.map((edu, i) => (
                // <li key={`education-${i}`}>{edu}</li>
                <li key={`edu-${i}`}>
                  {edu.degree} at {edu.institution} ({edu.year}) ({edu.major})
                  {Array.isArray(edu.relevant_coursework) &&
                    edu.relevant_coursework.length > 0 && (
                      <ul>
                        {edu.relevant_coursework.map((course, j) => (
                          <li key={`course-${i}-${j}`}>{course}</li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>

            <h3>Experience</h3>
            {resumeProfile.total_years_experience && (
              <p style={{ marginTop: -12, marginBottom: 8 }}>
                <strong>Total YOEc:</strong> {resumeProfile.total_years_experience}{" "}
                years
              </p>
            )}
            <ul>
              {resumeProfile.experience.map((exp, i) => (
                // <li key={`experience-${i}`}>{exp}</li>
                <li key={`exp-${i}`}>
                  {exp.job_title} at {exp.company} ({exp.dates})
                  {Array.isArray(exp.accomplishments) &&
                    exp.accomplishments.length > 0 && (
                      <ul>
                        {exp.accomplishments.map((acomp, j) => (
                          <li key={`acomp-${i}-${j}`}>{acomp}</li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>

            <h3>Projects</h3>
            <ul>
              {resumeProfile.projects.map((proj, i) => (
                <li key={`proj-${i}`}>
                  <strong>{proj.name}</strong>
                  <ul>
                    {proj.description.map((bullet, j) => (
                      <li key={`proj-${i}-bullet-${j}`}>{bullet}</li>
                    ))}
                  </ul>
                  <em>Technologies: {proj.technologies.join(", ")}</em>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
