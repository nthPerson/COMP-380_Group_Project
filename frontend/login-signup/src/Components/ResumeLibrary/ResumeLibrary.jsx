/*
Main UI for listing, deleting, and setting master resumes
*/

import { use, useEffect, useState } from "react";
import { deleteUserPdf, listUserPdfs, setMasterPdf, getMasterPdf } from "../../services/resumeService";
import { auth } from "../../firebase";

function ResumeLibrary() {
    const [pdfs, setPdfs] = useState([]);
    const [masterDocID, setMasterdocID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

        useEffect(() => {
        fetchPdfsAndMaster();
        // eslint-disable-next-line
    }, []);

    const fetchPdfsAndMaster = async () => {
        setLoading(true);
        try {
            // Fetch list of uploaded pdfs
            const pdfList = await listUserPdfs();
            setPdfs(pdfList);

            // Fetch master docID after fetching pdfs
            const data = await getMasterPdf();
            setMasterdocID(data.master_docID);
        } catch {
            alert("Error loading resumes or master resume.");
        }
        setLoading(false);
    };

    const fetchPdfs = async () => {
        setLoading(true);
        try {
            const pdfList = await listUserPdfs();
            setPdfs(pdfList);
        } catch (e) {
            alert("Error loading resumes");
        }
        setLoading(false);
    };

    const fetchMasterdocID = async () => {
        const idToken = await auth.currentUser.getIdToken();
        const res = await fetch(`http://localhost:5001/api/get_master_pdf`, // This avoids adding the master_docID to every document
        { headers: { Authorization: `Bearer ${idToken}` } }
        );
        if (res.ok) {
        const data = await res.json();
        setMasterdocID(data.master_docID);
        }
    };

    const handleDelete = async (docID, fileName) => {
        if (window.confirm("Delete this resume?")) {
            try {
                await deleteUserPdf(docID); // Clears master_resume if user chooses to delete their master resume
                setStatusMessage(`Deleted file ${fileName}`);
                fetchPdfsAndMaster(); 
            } catch (e) {
                setStatusMessage("Failed to delete file");
            }
        }
    };

    const handleSetMaster = async (docID, fileName) => {
        try {
            await setMasterPdf(docID);
            setStatusMessage(`Master resume set to ${fileName}`);
            fetchPdfsAndMaster();
        } catch (e) {
            setStatusMessage("Failed to set master resume");
        }
    };

    // For testing, we're just going to highlight the master resume visually in the list
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
