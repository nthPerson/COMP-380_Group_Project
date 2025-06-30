import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase";
import Sidebar from "../Sidebar/Sidebar";
import ResumeViewerModal from "../ResumeLibrary/ResumeViewerModal";
import { usePdf } from "../PdfContext";
import { getResumeSignedUrl } from "../../services/resumeService";

import "../TailorResume/TailorResume.css";
import "../Sidebar/Sidebar.css";

export default function ResumeArchive() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { pdfs, handleDelete } = usePdf();

    const [selected, setSelected] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    const uploaded = pdfs.filter(p => !p.generated);
    const generated = pdfs.filter(p => p.generated);

    const toggle = docID => {
        setSelected(prev =>
            prev.includes(docID) ? prev.filter(id => id !== docID) : [...prev, docID]
        );
    };

    const handleView = async (storagePath) => {
        const url = await getResumeSignedUrl(storagePath);
        setSelectedResumeUrl(url);
        setIsModalOpen(true);
    };

    const handleDownload = async () => {
        for (const id of selected) {
            const pdf = pdfs.find(p => p.docID === id);
            if (!pdf) continue;
            const url = await getResumeSignedUrl(pdf.storagePath);
            const a = document.createElement("a");
            a.href = url;
            a.download = pdf.fileName;
            a.click();
        }
    };

    const handleDeleteSelected = async () => {
        for (const id of selected) {
            const pdf = pdfs.find(p => p.docID === id);
            if (pdf) await handleDelete(id, pdf.fileName);
        }
        setSelected([]);
    };

    const handleSignOut = async () => {
        await auth.signOut();
        navigate("/", { replace: true });
    };

    if (!user) {
        return (
            <p className="loading-text">
                <span className="spinner"/> Loading...
            </p>
        );
    }
    
    const renderList = items => (
        <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map(pdf => (
            <li key={pdf.docID} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label>
                <input type="checkbox" checked={selected.includes(pdf.docID)} onChange={() => toggle(pdf.docID)} />{' '}
                {pdf.fileName}
            </label>
            <span>
                <button onClick={() => handleView(pdf.storagePath)} style={{ marginRight: 8 }}>View</button>
            </span>
            </li>
        ))}
        </ul>
    );

    return (
        <div className="layout">
        <aside className="sidebar">
            <Sidebar user={user} />
        </aside>
        <main className="tailor-container">
            <header className="header">
            <h1 className="welcome-title">Resume Archive</h1>
            </header>

            <div className="tool-section" data-aos="fade-up">
            <h2>Uploaded Resumes</h2>
            {renderList(uploaded)}
            </div>

            <div className="tool-section" data-aos="fade-up">
            <h2>Tailored RezuMes</h2>
            {renderList(generated)}
            </div>

            {selected.length > 0 && (
            <div className="tool-section" data-aos="fade-up">
                <button onClick={handleDownload}>Download</button>
                <button style={{ marginLeft: 8 }} onClick={handleDeleteSelected}>Delete</button>
            </div>
            )}

            <div className="logout-container">
            <button className="logout-btn" onClick={handleSignOut}>Log Out</button>
            </div>
        </main>

        <ResumeViewerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            pdfUrl={selectedResumeUrl}
        />
        </div>
    );
}
