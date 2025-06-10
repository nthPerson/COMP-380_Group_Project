/*
Main UI for listing, deleting, and setting master resumes
*/

import React from "react";
import { usePdf } from "../PdfContext";

// import { use, useEffect, useState } from "react";
// import { deleteUserPdf, listUserPdfs, setMasterPdf, getMasterPdf } from "../../services/resumeService";
import { auth } from "../../firebase";

function ResumeLibrary() {
  const {
    pdfs,
    masterDocID,
    loading,
    statusMessage,
    handleDelete,
    handleSetMaster,
  } = usePdf();

      return (
        <div>
        <h2>Your Uploaded Resumes</h2>
        {statusMessage && (
            <div style={{ color: "#007bff", marginBottom: "10px" }}>{statusMessage}</div>
        )}
        {loading ? (
            <p>Loading...</p>
        ) : pdfs.length === 0 ? (
            <p>No resumes uploaded yet.</p>
        ) : (
            
            <ul style={{ listStyle: "none", padding: 0 }}>
            {!masterDocID && (
                <div style={{ color: "orange", marginBottom: "10px" }}>
                    No master resume set
                </div>
            )}
            

            {pdfs.map((pdf) => (
                <li
                key={pdf.docID}
                style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                    background:
                    pdf.docID === masterDocID ? "#e6ffe6" : "#f9f9f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                >
                <span>
                    <strong>{pdf.fileName}</strong>
                    {pdf.docID === masterDocID && (
                    <span
                        style={{
                        color: "green",
                        fontWeight: "bold",
                        marginLeft: 10,
                        }}
                    >
                        (Master Resume)
                    </span>
                    )}
                </span>
                <span>
                    {pdf.docID !== masterDocID && (
                    <button
                        onClick={() => handleSetMaster(pdf.docID, pdf.fileName)}
                        style={{ marginRight: 8 }}
                    >
                        Set as Master
                    </button>
                    )}
                    <button
                    onClick={() => handleDelete(pdf.docID, pdf.fileName)}
                    style={{ color: "red" }}
                    >
                    Delete
                    </button>
                </span>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}

export default ResumeLibrary;

//   return (
//     <div>
//       <h2>Your Uploaded Resumes</h2>
//       {statusMessage && (
//         <div style={{ color: "#007bff", marginBottom: "10px" }}>{statusMessage}</div>
//       )}
//       {loading ? (
//         <p>Loading...</p>
//       ) : pdfs.length === 0 ? (
//         <p>No resumes uploaded yet.</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {!masterDocID && (
//             <div style={{ color: "orange", marginBottom: "10px" }}>
//               No master resume set
//             </div>
//           )}
//           {pdfs.map((pdf) => (
//             <li
//               key={pdf.docID} // make sure you are using the correct key
//               style={{
//                 border: "1px solid #ccc",
//                 borderRadius: 8,
//                 padding: 10,
//                 marginBottom: 10,
//                 background: (pdf.docId || pdf.docID) === masterDocID ? "#e6ffe6" : "#f9f9f9",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <span>
//                 <strong>{pdf.fileName}</strong>
//                 {(pdf.docID) === masterDocID && (
//                   <span style={{ color: "green", fontWeight: "bold", marginLeft: 10 }}>
//                     (Master Resume)
//                   </span>
//                 )}
//               </span>
//               <span>
//                 {(pdf.docID) !== masterDocID && (
//                   <button
//                     onClick={() =>
//                       handleSetMaster(pdf.docID, pdf.fileName)
//                     }
//                     style={{ marginRight: 8 }}
//                   >
//                     Set as Master
//                   </button>
//                 )}
//                 <button
//                   onClick={() => handleDelete(pdf.docID, pdf.fileName)}
//                   style={{ color: "red" }}
//                 >
//                   Delete
//                 </button>
//               </span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default ResumeLibrary;
