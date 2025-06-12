import React, { useState, useCallback } from "react";
import { usePdf } from "../PdfContext";
import { extractResumeSkills } from "../../services/resumeService";

export default function SkillHighlighter({ jobSkills }) {
    const { masterDocID } = usePdf();
    const [resumeSkills, setResumeSkills] = useState([]);
    const [loadingResume, setLoadingResume] = useState(false);

  // Handler to fetch resume skills on demand
    const loadResumeSkills = useCallback(async () => {
        if (!masterDocID) return;
        setLoadingResume(true);
        try {
            const skills = await extractResumeSkills(masterDocID);
            setResumeSkills(skills);
        } catch {
            setResumeSkills([]);
        }
        setLoadingResume(false);
    }, [masterDocID]);
  

  /* Commented code below can be used to extract skills from resume each time the 
  master resume is tagged. Had a few problems with the pdf list not loading on 
  Homepage load, and this was removed in the process, but it might work because a 
  solution (lazy loading of backend nlp for skills extraction) was found and this 
  functionality was not reintroduced and tested */
  //   const loadResumeSkills = async () => {
  //       if (!masterDocID) return;
  //       setLoadingResume(true);
  //       try {
  //       const skills = await extractResumeSkills(masterDocID);
  //       setResumeSkills(skills);
  //       } catch {
  //       setResumeSkills([]);
  //       }
  //       setLoadingResume(false);
  // };

  // // Auto-run resume skill extraction when the master resume is set by the user
  // useEffect(() => {
  //   if (masterDocID) loadResumeSkills();
  // }, [masterDocID, loadResumeSkills]);

  return (
    <div style={{ margin: "20px 0", padding: "10px", border: "1px solid #ddd" }}>
      <h3>Job Description Skills:</h3>
      {jobSkills?.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {jobSkills.map((kw) => (
            <span key={kw} style={{ /* styling...*/ }}>
              {kw}
            </span>
          ))}
        </div>
      ) : (
        <p><em>No skills extracted from JD.</em></p>
      )}

      <h3 style={{ marginTop: 16 }}>Resume Skills:</h3>

     {/* Extract Resume Skills Button */}
     {masterDocID && (
       <button
         onClick={loadResumeSkills}
         disabled={loadingResume}
         style={{ marginBottom: 10 }}
       >
         {loadingResume ? "Extracting…" : "Extract Resume Skills"}
       </button>
     )}

      {loadingResume ? (
        <p>Loading resume skills…</p>
      ) : resumeSkills.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {resumeSkills.map((kw) => (
            <span key={kw} style={{ /* styling...*/ }}>
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

// import React, { useState, useEffect } from "react";
// import { usePdf } from "../PdfContext";
// import { extractResumeSkills } from "../../services/resumeService";

// export default function SkillHighlighter({ jobSkills }) {
//   const { masterDocID } = usePdf();
//   const [resumeSkills, setResumeSkills] = useState([]);
//   const [loadingResume, setLoadingResume] = useState(false);

//   useEffect(() => {
//     const loadResumeSkills = async () => {
//       if (!masterDocID) {
//         setResumeSkills([]);
//         return;
//       }
//       setLoadingResume(true);
//       try {
//         const skills = await extractResumeSkills(masterDocID);
//         setResumeSkills(skills);
//       } catch {
//         setResumeSkills([]);
//       }
//       setLoadingResume(false);
//     };
//     loadResumeSkills();
//   }, [masterDocID]);

//   return (
//     <div style={{ margin: "20px 0", padding: "10px", border: "1px solid #ddd" }}>
//       <h3>Job Description Skills:</h3>
//       {jobSkills?.length > 0 ? (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//           {jobSkills.map((kw) => (
//             <span
//               key={kw}
//               style={{
//                 background: "#eef",
//                 padding: "4px 8px",
//                 borderRadius: 4,
//                 fontSize: "0.9rem",
//               }}
//             >
//               {kw}
//             </span>
//           ))}
//         </div>
//       ) : (
//         <p><em>No skills extracted from JD.</em></p>
//       )}

//       <h3 style={{ marginTop: 16 }}>Resume Skills:</h3>
//       {loadingResume ? (
//         <p>Loading resume skills…</p>
//       ) : resumeSkills.length > 0 ? (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//           {resumeSkills.map((kw) => (
//             <span
//               key={kw}
//               style={{
//                 background: "#efe",
//                 padding: "4px 8px",
//                 borderRadius: 4,
//                 fontSize: "0.9rem",
//               }}
//             >
//               {kw}
//             </span>
//           ))}
//         </div>
//       ) : (
//         <p><em>No skills extracted from resume.</em></p>
//       )}
//     </div>
//   );
// }
