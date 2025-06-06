// src/Components/Homepage/Homepage.jsx

import React, { useState, useEffect } from "react";
// import the auth and change on to track
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";

//for navigating
import { useNavigate } from "react-router-dom";

// for signout functionality: it's in services
import { handleSignout } from "../../services/authHandlers";
// axios is what let's us make API calls in React notes on AXIOS is in the project notion
import axios from "axios";

// import the JD sending logic from the services
import { sendJobDescription } from "../../services/jobDescriptionService";

import "./Homepage.css";

export default function Homepage() {
  // local state to store the current Firebase user
  const [user, setUser] = useState(null);
  // local state for JD input are
  const [jdText, setJdText] = useState("");
  // used for gemini explanation
  const [jdExplanation, setJdExplanation] = useState("");

  //for navigation
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); //update the user with the current user with the onAuthStateChanged to change the current user to the current one
    });
    // clean up the listener when the component clears
    return () => unsubscribe();
  }, []);

  const handleSendJD = async () => {
    const idToken = await user.getIdToken(); //since the user is already logged in at this point we can safely access their token
    try {
      const res = await sendJobDescription(jdText, idToken);
      setJdExplanation(res.explanation || "No explanation returned");
    } catch (err) {
      console.log("Error sending JD", err);
    }
  };

  const handleSignOutOnClick = async () => {
    try {
      await handleSignout();
      navigate("/", { replace: true });
    } catch (err) {
      console.log("Sign Out Error", err);
    }
  };

  return (
    <>
      {/* ─── MAIN CONTENT ─── */}
      <div className="homepage-container">
        {user ? (
          <>
            <h1>Welcome, {user.displayName || "User"}!</h1>
            <p>You are now logged in and on the Home page.</p>
            <p>Email: {user.email}</p>

            {/* JD paste area*/}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendJD();
              }}
              className="jd-form"
            >
              <h3>Paste a Job Description</h3>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Enter job description here..."
                rows={6}
                cols={50}
              />
              <br />
              <button type="submit">Send JD</button>
            </form>
            {jdExplanation && (
              <div className="jd-explanation">
                <h3>Gemini's Explanation</h3>
                <p>{jdExplanation}</p>
              </div>
            )}
            <button onClick={handleSignOutOnClick}>Logout</button>
          </>
        ) : (
          <p>Loading user...</p>
        )}
      </div>
    </>
  );
}
