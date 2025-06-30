import React, { createContext, useContext, useState } from "react";

const TargetedResumeContext = createContext()

export function TargetedResumeProvider({ children }) {
    const [jdContent, setJdContent] = useState("");
    const [jdExplanation, setJdExplanation] = useState("");
    const [generatedHtml, setGeneratedHtml] = useState("");

    const value = {
        jdContent,
        setJdContent,
        jdExplanation,
        setJdExplanation,
        generatedHtml,
        setGeneratedHtml,
    };
    return (
        <TargetedResumeContext.Provider value={value}>
            {children}
        </TargetedResumeContext.Provider>
    );
}

export function useTargetedResume() {
    return useContext(TargetedResumeContext);
}
