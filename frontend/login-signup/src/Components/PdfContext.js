import React, { createContext, useContext, useState, useCallback } from "react";
import {
    listUserPdfs,
    deleteUserPdf,
    setMasterPdf,
    getMasterPdf,
} from "../services/resumeService";
import { useInRouterContext } from "react-router-dom";

// PdfContext (fancy React approach to making commonly-used functions available to multiple compontents)
const PdfContext = createContext();

// Custom hook for consuming the context from other compnonents
export function userPdf() {
    return useContext(PdfContext);
}

// Provider component
export function PdfProvider({ children }) {
    const [pdfs, setPdfs] = useState([]);
    const [masterDocId, setMasterDocID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    // Fetch both PDF list and master resume 
    const fetchPdfsAndMaster = useCallback(async () => {
        setLoading(true);
        try {
            const pdfList = await listUserPdfs();  // Fetches list of user docs from Firestore
            setPdfs(pdfList);

            const data = await getMasterPdf();  // Fetches master PDF ID from Firestore
            setMasterDocID(data.masterDocId);
        } catch {
            setStatusMessage("Error loading resumes or master resume");
        }
        setLoading(false);
    }, []);

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
            await setMasterPdf(docID); n // Set 
            setStatusMessage(`Master resume set to ${fileName}`);
            fetchPdfsAndMaster();
        } catch {
            setStatusMessage("Fauled to set master resume");
        }
    }, [fetchPdfsAndMaster]);

    // Expose values and handlers to components nested within this context in App.js
    const value = {
        pdfs,
        masterDocId,
        loading,
        statusMessage,
        setStatusMessage,
        fetchPdfsAndMaster,
        handleDelete,
        handleSetMaster,
    };

    return (
        <PdfContext.Provider value={value}>
        {children}
        </PdfContext.Provider>
    );

}

