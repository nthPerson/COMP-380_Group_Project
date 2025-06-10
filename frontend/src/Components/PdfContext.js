import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
    listUserPdfs,
    deleteUserPdf,
    setMasterPdf,
    getMasterPdf,
} from "../services/resumeService";
import { useInRouterContext } from "react-router-dom";
import { auth } from "../firebase";

// PdfContext (fancy React approach to making commonly-used functions available to multiple compontents)
const PdfContext = createContext();

// Custom hook for consuming/using the context (values and functions) from other compnonents
export function usePdf() {
    return useContext(PdfContext);
}

// Provider component
export function PdfProvider({ children }) {
    const [pdfs, setPdfs] = useState([]);
    const [masterDocID, setMasterDocID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

      // Fetch both PDF list and master resume 
    const fetchPdfsAndMaster = useCallback(async () => {
        setLoading(true);
        try {
            const pdfList = await listUserPdfs();  // Fetches list of user docs from Firestore
            setPdfs(pdfList);

            const data = await getMasterPdf();  // Fetches master PDF ID from Firestore
            setMasterDocID(data.masterDocID);
        } catch {
            setStatusMessage("Error loading resumes or master resume");
        }
        setLoading(false);
    }, []);

    // Fetch PDFs and master on initial load
    useEffect(() => {
        fetchPdfsAndMaster();
    }, [fetchPdfsAndMaster]);

    //   useEffect(() => {
    //     axios.get('/api/list_pdfs')
    //     .then(res => setResumes(res.data))
    //     .catch(err => console.error(err));
    // }, []); // empty dependency array = run on page load (mount)

    // Just fetch the PDF list
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

    // TODO: this function should be a "wrapper"-ish function with its real implementation in resumeService.js
    const fetchMasterdocID = async () => {
        const idToken = await auth.currentUser.getIdToken();
        const res = await fetch(`http://localhost:5001/api/get_master_pdf`, // This avoids adding the master_docID to every document
        { headers: { Authorization: `Bearer ${idToken}` } }
        );
        if (res.ok) {
        const data = await res.json();
        setMasterDocID(data.masterDocID);
        }
    };

    // TODO: this function should be a "wrapper"-ish function with its real implementation in resumeService.js
    const uploadPdf = useCallback(async (file) => {
        if (!file) return;
        try {
            const idToken = await auth.currentUser.getIdToken();

            const formData = new FormData();
            formData.append("file", file);

            await fetch("http://localhost:5001/api/upload_pdf", {
                method: "POST",
                headers: { Authorization: `Bearer ${idToken}`},
                body: formData,
            });

            setStatusMessage("PDF uploaded successfully!");
            fetchPdfsAndMaster();  // Refresh the list of PDFs after upload
        } catch (e) {
            setStatusMessage("Failed to upload PDF");
        }
    }, [fetchPdfsAndMaster]);

    // Delete PDF (and refresh list when complete)
    const handleDelete = useCallback(async (docID, fileName) => {
        if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
            try {
                await deleteUserPdf(docID);
                setStatusMessage(`Deleted file ${fileName}`);
                fetchPdfsAndMaster();
            } catch {
                setStatusMessage("Failed to delete file");
            }
        }
    }, [fetchPdfsAndMaster]);

    // Set master PDF (and refresh list when complete)
    const handleSetMaster = useCallback(async (docID, fileName) => {
        try {
            await setMasterPdf(docID); // Set 
            setStatusMessage(`Master resume set to ${fileName}`);
            fetchPdfsAndMaster();
        } catch {
            setStatusMessage("Failed to set master resume");
        }
    }, [fetchPdfsAndMaster]);

    // Expose values and handlers to components nested within this context in App.js
    const value = {
        pdfs,
        masterDocID,
        loading,
        statusMessage,
        setStatusMessage,
        fetchPdfsAndMaster,
        fetchPdfs,
        fetchMasterdocID,
        uploadPdf,
        handleDelete,
        handleSetMaster,
    };

    return (
        <PdfContext.Provider value={value}>
            {children}
        </PdfContext.Provider>
    );

}

