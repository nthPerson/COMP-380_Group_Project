import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { auth } from "../../firebase";
import { onIdTokenChanged } from "firebase/auth";
import { saveJobDescription, listJobDescriptions, setActiveJobDescription, getActiveJobDescription, deleteJobDescription } from "../../services/jobDescriptionService";

const JdContext = createContext();

export function useJd() {
    return useContext(JdContext);
}

export function JdProvider({ children }) {
    const [jds, setJds] = useState([]);
    const [activeJdID, setActiveJdID] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchJdsAndActive = useCallback(async () => {
        setLoading(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            const list = await listJobDescriptions(idToken);
            setJds(list.jds || list);
            const active = await getActiveJobDescription(idToken);
            setActiveJdID(active.activeJdID);
        } catch (e) {
            console.error("Error loading job descriptions", e);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, (user) => {
            if (user) {
                fetchJdsAndActive();
            } else {
                setJds([]);
                setActiveJdID(null);
            }
        });
        return () => unsubscribe();
    }, [fetchJdsAndActive]);

    const addJd = async (title, text) => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            await saveJobDescription(title, text, idToken);
            fetchJdsAndActive();
        } catch (e) {
            console.error("Failed to save job description", e);
        }
    };

    const setActive = async (id) => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            const res = await setActiveJobDescription(id, idToken);
            setActiveJdID(id);
            return res.jd;
        } catch (e) {
            console.error("Failed to set active JD", e);
            return null;
        }
    };

    const removeJd = async (id) => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            await deleteJobDescription(id, idToken);
            fetchJdsAndActive();
        } catch (e) {
            console.error("Failed to delete JD", e);
        }
    };

    const value = {
        jds,
        activeJdID,
        loading,
        addJd,
        setActive,
        fetchJdsAndActive,
        removeJd,
    };

    return (
        <JdContext.Provider value={value}>
            {children}
        </JdContext.Provider>
    );
}

