import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../../firebase";
import Sidebar from "../../Sidebar/Sidebar";
import ResumeViewerModal from "../../Helpers/ResumeLibrary/ResumeViewerModal";
import { usePdf } from "../../PdfContext";
import { getResumeSignedUrl } from "../../../services/resumeService";

import "./ResumeArchive.css";
import "../../Sidebar/Sidebar.css";
import "../UserProfile/UserProfile.css";

//date formatter helper function 
function formatDateTime(dt){
    if (!dt) return "";
    const date = typeof dt === "string" ? new Date(dt) : dt?.toDate ? dt.toDate() : new Date(dt); // 🟢
    return date.toLocaleString([], { dateStyle: "short", timeStyle: "short" }); // 🟢
}
export default function ResumeArchive() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { pdfs, handleDelete } = usePdf();

    const [selected, setSelected] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResumeUrl, setSelectedResumeUrl] = useState(null);
    const [activeTab, setActiveTab] = useState("uploaded");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    const uploaded = pdfs.filter(p => !p.generated && !p.created);
    const generated = pdfs.filter(p => p.generated);
    const created = pdfs.filter((p) => p.created);

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
            a.target = "_blank";               // ← open in new tab
            a.rel = "noopener noreferrer";     // ← security best practice
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
                <span className="spinner" /> Loading...
            </p>
        );
    }

    const renderList = (items) => (
        <ul className="resume-list">
            {items.map((pdf) => (
                <li key={pdf.docID} className="resume-item">
                    <span className="resume-filename">
                        <input
                            type="checkbox"
                            checked={selected.includes(pdf.docID)}
                            onChange={() => toggle(pdf.docID)}
                        />{" "}
                        {pdf.fileName}
                    </span>
                    <div className="actions">
                        <span className="resume-date">
                            {formatDateTime(pdf.createdAt || pdf.uploadedAt)}
                        </span>
                        <button onClick={() => handleView(pdf.storagePath)}>View</button>
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="layout">
            
            <Sidebar user={user} />
            
            <main className="archive-container">
                <header className="header">
                    <h1 className="welcome-title">RezuMe Archive</h1>
                </header>


                <div className="tabs-actions-container">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === "uploaded" ? "active" : ""}`}
                            onClick={() => setActiveTab("uploaded")}

                        >
                            Uploaded Resumes
                        </button>
                        <button
                            className={`tab ${activeTab === "created" ? "active" : ""}`}
                            onClick={() => setActiveTab("created")}
                        >
                            Created RezuMes
                        </button>
                        <button
                            className={`tab ${activeTab === "tailored" ? "active" : ""}`}
                            onClick={() => setActiveTab("tailored")}
                        >
                            Tailored RezuMes
                        </button>
                    </div>

                    <div className={`actions-bar button-row ${selected.length > 0 ? "has-selection" : ""}`}>
                    <div className="button-group-right">
                        <button type="button" className="button" onClick={handleDownload} disabled={selected.length === 0}>
                            Download
                        </button>
                        <button type="button" className="button" onClick={handleDeleteSelected} disabled={selected.length === 0}>
                            Delete
                        </button>
                    </div>
                    </div>
                </div>
                    <div className="tool-section resume-archive-panel">
                        <div className="tab-content">
                            {activeTab === "uploaded" && (
                                uploaded.length > 0
                                    ? renderList(uploaded)
                                    : <p className="empty-message">No uploaded resumes.</p>
                            )}

                            {activeTab === "created" && (
                                created.length > 0
                                    ? renderList(created)
                                    : <p className="empty-message">No created RezuMes.</p>
                            )}

                            {activeTab === "tailored" && (
                                generated.length > 0
                                    ? renderList(generated)
                                    : <p className="empty-message">No tailored RezuMes.</p>
                            )}
                        </div>
                    </div>
                     


                <div className="logout-container">
                    <button className="logout-btn" onClick={handleSignOut}>
                        Log Out
                    </button>
                </div>

                <ResumeViewerModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    pdfUrl={selectedResumeUrl}
                />
            </main>
        </div>
    );
}

