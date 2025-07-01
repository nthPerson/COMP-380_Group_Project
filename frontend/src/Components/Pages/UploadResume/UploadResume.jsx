import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { auth } from "../../../firebase";
import Sidebar from "../../Sidebar/Sidebar";
import UploadPdf from "../../Helpers/UploadPdf/UploadPdf";
import ResumeLibrary from "../../Helpers/ResumeLibrary/ResumeLibrary";
import { usePdf } from "../../PdfContext";

<<<<<<< HEAD:frontend/src/Components/UploadResume/UploadResume.jsx
import { getProfile } from "../../services/profileService";

=======
import "../../Sidebar/Sidebar.css";
>>>>>>> 837d041334069c52da773b93158e7febebcf04cd:frontend/src/Components/Pages/UploadResume/UploadResume.jsx
import "../TailorResume/TailorResume.css";

export default function UploadResume() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const { fetchPdfsAndMaster } = usePdf();

    const [profile, setProfile] = useState({ username: "", photoURL: "" });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, u => setUser(u));
        return () => unsub();
    }, []);

    
  useEffect(() => {
    // mirror UserProfile/Header: listen for auth, then getProfile, then kick off PDFs
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);

      if (fbUser) {
        // 1) load Firestore profile (same as UserProfile)
        try {
          const p = await getProfile();
          setProfile({
            username: p.username || fbUser.displayName || "User",
            photoURL: p.photoURL || "", 
          });
        } catch (err) {
          console.error("UploadResume: getProfile failed", err);
        }

        // 2) now that we’ve fully initialized the user + profile,
        //    fetch PDFs and the master PDF.
        try {
          await fetchPdfsAndMaster();
        } catch (err) {
          console.error("UploadResume: fetchPdfsAndMaster failed", err);
        }
      }
    });

    return () => unsubscribe();
  }, [fetchPdfsAndMaster]);

    // Refresh list on first visit
    useEffect(() => {
        if (user) {
            fetchPdfsAndMaster();
        }
    }, [user, fetchPdfsAndMaster]);
    // useEffect(() => { fetchPdfsAndMaster(); }, [fetchPdfsAndMaster]);

    const handleSignOut = async () => {
        await auth.signOut();
        navigate("/", { replace: true });
    };

    if (!user) {
        return (
            <p className="loading-text"> 
                <span className="spinner"/> Loading...
            </p>
            
        )
    };

    return (
        <div className="layout">
        <aside className="sidebar">
            <Sidebar user={user} />
        </aside>
        <main className="tailor-container">
            <header className="header">
            <h1 className="welcome-title">Upload Resume</h1>
            <p className="welcome-subtext">
                You're logged in as <strong>{user.email}</strong>
            </p>
            </header>

            <div className="tool-section" data-aos="fade-up">
                <UploadPdf />
            </div>

            <div className="tool-section" data-aos="fade-up">
                <ResumeLibrary showGenerated={false} showUploaded={true} />
            </div>

            <Link to="/addJobDescription" className="get-started-btn">
              Next: Add a Job Description!
            </Link>

            <div className="logout-container">
                <button className="logout-btn" onClick={handleSignOut}>Log Out</button>
            </div>
        </main>
        </div>
    );

}

