import React, { useState, useEffect } from "react";
import { extractResumeProfileLLM } from "../../services/resumeService";
import {
  extractJdProfileText,
  extractJdProfileUrl
} from "../../services/jobDescriptionService";
import { auth } from "../../firebase";

export default function ProfileExtractor ({masterDocID, jdText, jdUrl}) {
  const [resumeProfile, setResumeProfile] = useState(null);
  const [jdProfile, setJdProfile] = useState(null);
  const [loading, setLoading] = useState({ resume: false, jd: false });
  const [error,   setError]   = useState(null);

  // Fetch the resume profile (skills, education, professional experience) from master resume
  useEffect(() => {
    if (!masterDocID) return;
    setLoading(l => ({ ...l, resume: true }));
    extractResumeProfileLLM(masterDocID)
        .then(profile => setResumeProfile(profile))
        .catch(err => setError(err.toString()))
        .finally(() => setLoading(l => ({ ...l, resume: false })));
  }, [masterDocID]);

  // Fetch the job description profile (required_skills, required_education, required_experience, responsibilities) from JD (text or URL)
    useEffect(() => {
        if (!jdText && ! jdUrl) return;

        async function fetchJdProfile() {
            setLoading(l => ({ ...l, jd: true }));
            try {
                // Fetch Firebase ID token
                const idToken = await auth.currentUser.getIdToken();

                let profile;
                if (jdText) {
                    profile = await extractJdProfileText(jdText, idToken);
                } else {
                    profile = await extractJdProfileUrl(jdUrl, idToken);
                }

                setJdProfile(profile);
            } catch (err) {
                setError(err.toString());
            } finally {
                setLoading(l => ({ ...l, jd: false }));
            }
        }

        fetchJdProfile();
  }, [jdText, jdUrl]);

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div style={{ display: "flex", gap: 40, marginTop: 24 }}>
      {/* Job Description Profile */}
      <section style={{ flex: 1 }}>
        <h2>Job Description Profile</h2>
        {loading.jd && <p>Loading JD profile…</p>}
        {jdProfile && (
          <>
            <h3>Required Skills</h3>
            <ul>
              {jdProfile.required_skills.map(s => <li key={s}>{s}</li>)}
            </ul>
            <h3>Required Education</h3>
            <ul>
              {jdProfile.required_education.map(s => <li key={s}>{s}</li>)}
            </ul>
            <h3>Required Experience</h3>
            <ul>
              {jdProfile.required_experience.map(s => <li key={s}>{s}</li>)}
            </ul>
            <h3>Responsibilities</h3>
            <ul>
              {jdProfile.responsibilities.map(s => <li key={s}>{s}</li>)}
            </ul>
          </>
        )}
      </section>

      {/* Resume Profile */}
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
                <li key={`edu-${i}`}>
                  {/* Render degree, institution, year */}
                  {edu.degree} at {edu.institution} ({edu.year})
                </li>
              ))}
            </ul>

            <h3>Experience</h3>
            <ul>
              {resumeProfile.experience.map((exp, i) => (
                <li key={`exp-${i}`}>
                  {/* Render job_title, company, dates */}
                  {exp.job_title} at {exp.company} ({exp.dates})
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}