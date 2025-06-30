import { auth } from "../../firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import Sidebar from "../Sidebar/Sidebar";
import "../Sidebar/Sidebar.css";
import "./WelcomeInstructions.css"
import { Link } from "react-router-dom";
const steps = [
    {
        title: "Upload Your Master Resume",
        desc: "Start by uploading your main, complete resume to the application."
    },
    {
        title: "Provide a Job Description",
        desc: "Either paste the job description text or enter the URL of the job posting."
    },
    {
        title: "Select Keywords to Emphasize",
        desc: "Choose the skills or keywords you want to highlight in your tailored resume."
    },
    {
        title: "Generate a Targeted Resume",
        desc: "Let RezuMe craft a custom resume using your master resume and the job details."
    },
    {
        title: "Review and Edit",
        desc: "Make any changes you'd like in the built-in editor."
    },
    {
        title: "Export Your New Resume",
        desc: "Download the final PDF or save it back to your library."
    }
];

export default function WelcomeInstructions() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    if (!user) return <p>Loading...</p>;

  return (
    <div className="welcome-layout">

      {/* Sidebar */}
      <Sidebar user={user} />
      <main className="welcome-content">

        {/* Title */}
        <h1 className="welcome-heading">
          Welcome to RezuMe, {user.displayName || "User"}! <span className="wave">👋</span>
        </h1>
        <h2 className="instructions-title">How to Tailor Your RezuMe</h2>

        {/* Instructions List */}
        <ol className="instructions-list">
          {steps.map((step, idx) => (
            <li key={idx} className="instruction-item">
              <div className="instruction-icon" aria-hidden="true">🔹</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Get Started Buttons */}
        <div>
          <h2>Get Started Here!</h2>
          <Link to="/uploadResume" className="get-started-btn">
              Have a Resume? Click here to get started!
          </Link>
          <Link to="/createResume" className="get-started-btn">
              Don't Have a Resume? Click Here to Get Started!
          </Link>
        </div>
        
      </main>
    </div>
  );
}
