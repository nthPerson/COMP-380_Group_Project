import { auth } from "../../../firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import "./WelcomeInstructions.css";
import Sidebar from "../../Sidebar/Sidebar";
import "../../Sidebar/Sidebar.css";

const steps = [
  {
    title: "Upload Your Master Resume",
    desc: "Start by uploading your full resume to the app",
  },
  {
    title: "Provide a Job Description",
    desc: "Paste the job description text or enter its URL",
  },
  {
    title: "Pick Keywords to Emphasize",
    desc: "Select the skills or terms you want highlighted",
  },
  {
    title: "Generate Your Tailored RezuMe",
    desc: "RezuMe will craft a custom version for you",
  },
  {
    title: "Review & Tweak",
    desc: "Make edits in the built-in editor as you like",
  },
  {
    title: "Export & Share",
    desc: "Download the PDF or save it back to your library",
  },
];

export default function WelcomeInstructions() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return <p className="loading">Loading…</p>;

  return (
    <div className="landing">

      <Sidebar user={user} />

      <main className="content">
        <h1 className="heading">
          Welcome, {user.displayName || "User"} <span className="wave">👋</span>
        </h1>
        <h2 className="subheading">Getting Started with RezuMe</h2>

        <ol className="stepsList">
          {steps.map((step, i) => (
            <li key={i}>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </li>
          ))}
        </ol>

        <div className="actions">
          <Link to="/createResume" className="button">
            Create RezuMe
          </Link>
          <span className="orText">or</span>
          <Link to="/uploadResume" className="button">
            Upload Resume
          </Link>
          
          
        </div>
      </main>
    </div>
  );
}
