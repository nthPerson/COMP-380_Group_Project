import React from "react";
import { useJd } from "./JdContext";

export default function JobDescriptionLibrary() {
    const { jds, activeJdID, setActive, loading } = useJd();

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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span>
                            <strong>{jd.title}</strong>
                            {jd.id === activeJdID && (
                                <span style={{ color: "green", fontWeight: "bold", marginLeft: 10 }}>
                                    (Active)
                                </span>
                            )}
                        </span>
                        <span>
                            {jd.id !== activeJdID && (
                                <button onClick={() => setActive(jd.id)} style={{ marginRight: 8 }}>
                                    Set Active
                                </button>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}


