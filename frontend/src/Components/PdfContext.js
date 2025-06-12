import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
    listUserPdfs,
    deleteUserPdf,
    setMasterPdf,
    getMasterPdf,
} from "../services/resumeService";
// import { useInRouterContext } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, onIdTokenChanged } from "firebase/auth";

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

    // "Subscribe" to auth changes to enable PDF list fetch on first load.
    // Since the PdfProvider (the PdfContext wrapper that provides all components access to PDF functions) 
    // currently wraps the entire app (and starts when the app first loads), and this useEffect() 
    // function runs as soon as it's loaded (right when the app launches), the list was not being populated 
    // because the user was not authenticated at the time that the fetchPdfsAndMaster() function inside runs (which 
    // requres the user's authentication ID to communicate with the backend API). The fix is to have the PdfProvider 
    // subscribe to an auth state listener to refresh the PDFs and master when a user logs in and clear them on logout.
    useEffect(() => {
        // const unsubscribe = onAuthStateChanged(auth, (user) => {
        const unsubscribe = onIdTokenChanged(auth, (user) => {  // Changed from auth state change to IdToken change (both might work)
            if (user) {
                fetchPdfsAndMaster();
            } else {
                setPdfs([]);
                setMasterDocID(null);
            }
        });
        return () => unsubscribe();
    }, [fetchPdfsAndMaster]);

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

            // Extract keywords from the master resume
    const extractKeywordsFromMaster = useCallback(async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            const res = await fetch("http://localhost:5001/api/extract_keywords", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ masterDocID }), // Send masterDocID to backend
            });

            if (res.ok) {
                const data = await res.json();
                console.log("✅ Extracted Keywords:", data.keywords);
                setStatusMessage("✅ Keywords extracted successfully.");
            } else {
                setStatusMessage("⚠️ Keyword extraction failed.");
            }
        } catch (error) {
            console.error("Keyword Extraction Error:", error);
            setStatusMessage("Error extracting keywords.");
        }
    }, [masterDocID]);

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
        extractKeywordsFromMaster,
    };

    return (
        <PdfContext.Provider value={value}>
            {children}
        </PdfContext.Provider>
    );

}

