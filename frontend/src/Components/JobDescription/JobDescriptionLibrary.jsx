import React, { useState } from "react";
import { useJd } from "./JdContext";

export default function JobDescriptionLibrary() {
    const { jds, activeJdID, setActive, removeJd, loading } = useJd();
    const [expanded, setExpanded] = useState(null);

    if (loading) return <p>Loading...</p>;
    if (jds.length === 0) return <p>No job descriptions saved.</p>;

    return (
        <div className="tool-section" data-aos="fade-up">
            <h2>Saved Job Descriptions</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {jds.map(jd => (
                    <li
                        key={jd.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            padding: 10,
                            marginBottom: 10,
                            background: jd.id === activeJdID ? "#e6ffe6" : "#f9f9f9",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>
                                <strong>{jd.title}</strong>
                                {jd.id === activeJdID && (
                                    <span style={{ color: "green", fontWeight: "bold", marginLeft: 10 }}>
                                        (Active)
                                    </span>
                                )}
                            </span>
                            <span>
                                <button onClick={() => setExpanded(expanded === jd.id ? null : jd.id)} style={{ marginRight: 8 }}>
                                    {expanded === jd.id ? "Hide" : "View"}
                                </button>
                                {jd.id !== activeJdID && (
                                    <button onClick={() => setActive(jd.id)} style={{ marginRight: 8 }}>
                                        Set Active
                                    </button>
                                )}
                                <button onClick={() => removeJd(jd.id)}>Delete</button>
                            </span>
                        </div>
                        {expanded === jd.id && (
                            <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{jd.text}</pre>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}


