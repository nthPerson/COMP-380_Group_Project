/*
Main UI for listing, deleting, and setting master resumes
*/

import { use, useEffect, useState } from "react";
import { deleteUserPdf, listUserPdfs, setMasterPdf } from "../../services/resumeService";
import { auth } from "../../firebase";

function ResumeLibrary() {
    const [pdfs, setPdfs] = useState([]);
    const [masterDocId, setMasterDocId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user's PDFs on mount
    useEffect(() => {
        fetchPdfs();
        // Also fetch masterDocId
        fetchMasterDocId();
        // eslint-disable-next-line
    }, []);

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

    const fetchMasterDocId = async () => {
        const idToken = await auth.currentUser.getIdToken();
        const res = await fetch(
        `http://localhost:5001/api/get_master_pdf`, // This avoids adding the master_docId to every document
        { headers: { Authorization: `Bearer ${idToken}` } }
        );
        if (res.ok) {
        const data = await res.json();
        setMasterDocId(data.master_docId);
        }
    };

    const handleDelete = async (docId) => {
        if (window.confirm("Delete this resume?")) {
            await deleteUserPdf(docId);
            setPdfs(pdfs.filter((pdf) => pdf.docId !== docId));
            if (masterDocId === docId) setMasterDocId(null) // Clears master resume if user chooses to delete it
        }
    };

    const handleSetMaster = async (docId) => {
        await setMasterPdf(docId);
        setMasterDocId(docId);
    };

    // For testing, we're just going to highlight the master resume visually in the list
      return (
        <div>
        <h2>Your Uploaded Resumes</h2>
        {loading ? (
            <p>Loading...</p>
        ) : pdfs.length === 0 ? (
            <p>No resumes uploaded yet.</p>
        ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
            {pdfs.map((pdf) => (
                <li
                key={pdf.docId}
                style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                    background:
                    pdf.docId === masterDocId ? "#e6ffe6" : "#f9f9f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                >
                <span>
                    <strong>{pdf.fileName}</strong>
                    {pdf.docId === masterDocId && (
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
                    {pdf.docId !== masterDocId && (
                    <button
                        onClick={() => handleSetMaster(pdf.docId)}
                        style={{ marginRight: 8 }}
                    >
                        Set as Master
                    </button>
                    )}
                    <button
                    onClick={() => handleDelete(pdf.docId)}
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
