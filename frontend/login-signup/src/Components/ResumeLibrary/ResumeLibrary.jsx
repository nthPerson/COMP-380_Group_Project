/*
Main UI for listing, deleting, and setting master resumes
*/

import { use, useEffect, useState } from "react";
import { deleteUserPdf, listUserPdfs, setMasterPdf, getMasterPdf } from "../../services/resumeService";
import { auth } from "../../firebase";

function ResumeLibrary() {
    const [pdfs, setPdfs] = useState([]);
    const [masterdocID, setMasterdocID] = useState(null);
    const [loading, setLoading] = useState(true);

        useEffect(() => {
        fetchPdfsAndMaster();
        // eslint-disable-next-line
    }, []);

    const fetchPdfsAndMaster = async () => {
        setLoading(true);
        try {
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

        const handleDelete = async (docID) => {
        if (window.confirm("Delete this resume?")) {
            await deleteUserPdf(docID);
            fetchPdfsAndMaster(); // NOT CURRENTLY ACCURATE: Clears master resume if user chooses to delete it
        }
    };

        const handleSetMaster = async (docID) => {
        await setMasterPdf(docID);
        fetchPdfsAndMaster();
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
                key={pdf.docID}
                style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                    background:
                    pdf.docID === masterdocID ? "#e6ffe6" : "#f9f9f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                >
                <span>
                    <strong>{pdf.fileName}</strong>
                    {pdf.docID === masterdocID && (
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
                    {pdf.docID !== masterdocID && (
                    <button
                        onClick={() => handleSetMaster(pdf.docID)}
                        style={{ marginRight: 8 }}
                    >
                        Set as Master
                    </button>
                    )}
                    <button
                    onClick={() => handleDelete(pdf.docID)}
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
