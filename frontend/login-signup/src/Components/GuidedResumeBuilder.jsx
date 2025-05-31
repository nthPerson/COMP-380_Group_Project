import React, { useState } from 'react';

function GuidedResumeBuilder() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [skills, setSkills] = useState('');

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const resumeData = {
      name,
      email,
      education: {
        school,
        major,
        gradYear
      },
      skills: skills.split(',').map(skill => skill.trim())
    };
    console.log("Resume Data:", resumeData);
    alert("Resume saved! (Check browser console)");
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Guided Resume Builder</h2>

      {step === 1 && (
        <>
          <h3>Step 1: Personal Info</h3>
          <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} /><br /><br />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />
          <button onClick={handleNext}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Step 2: Education</h3>
          <input placeholder="School" value={school} onChange={(e) => setSchool(e.target.value)} /><br /><br />
          <input placeholder="Major" value={major} onChange={(e) => setMajor(e.target.value)} /><br /><br />
          <input placeholder="Graduation Year" value={gradYear} onChange={(e) => setGradYear(e.target.value)} /><br /><br />
          <button onClick={handlePrev}>Back</button>
          <button onClick={handleNext}>Next</button>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Step 3: Skills</h3>
          <input placeholder="Skills (comma-separated)" value={skills} onChange={(e) => setSkills(e.target.value)} /><br /><br />
          <button onClick={handlePrev}>Back</button>
          <button onClick={handleSubmit}>Finish</button>
        </>
      )}
    </div>
  );
}

export default GuidedResumeBuilder;
