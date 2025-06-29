/*
Main UI for listing, deleting, and setting master resumes
*/

import React, { useState } from "react";
import { usePdf } from "../PdfContext";
import ResumeViewerModal from "./ResumeViewerModal";
import { getResumeSignedUrl } from "../../services/resumeService.js";

// Import PDF manipulation methods from PdfContext.js (made available by the PdfProvider)
function ResumeLibrary() {
  const {
    pdfs,
    masterDocID,
    loading,
    statusMessage,
    handleDelete,
    handleSetMaster,
  } = usePdf();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);

  const handleView = async (storagePath) => {
    try {
      const url = await getResumeSignedUrl(storagePath);
      setSelectedResumeUrl(url);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching signed URL:", err);
    }
  };

  return (
    <div className="tool-section" data-aos="fade-up">
      <h2>Your Uploaded Resumes</h2>
      {statusMessage && (
        <div style={{ color: "#007bff", marginBottom: "10px" }}>
          {statusMessage}
        </div>
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
                background: pdf.docID === masterDocID ? "#e6ffe6" : "#f9f9f9",
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
                  onClick={() => handleView(pdf.storagePath)}
                  style={{ marginRight: 8 }}
                >
                  View
                </button>
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
      <ResumeViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfUrl={selectedResumeUrl}
      />
    </div>
  );
}

export default ResumeLibrary;
