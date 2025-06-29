import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { updateProfile, getProfile } from "../../services/profileService";
import Sidebar from "../Sidebar/Sidebar";
import "../Sidebar/Sidebar.css";
import "./UserProfile.css"
import { Link } from "react-router-dom";

import defaultAvatar from "../Assets/blank-avatar.png";

import AOS from "aos";
import "aos/dist/aos.css";


export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();

  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  // → Wait for Firebase auth, then load Firestore profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        return;
      }
      setUser(fbUser);

      // prefill email from auth (won’t overwrite if Firestore has its own)
      setForm(f => ({ ...f, email: fbUser.email || f.email }));

      try {
        const profile = await getProfile();
        setForm(f => ({
          username: profile.username ?? f.username,
          email: profile.email ?? f.email,
        }));
        if (profile.photoURL) {
          setPreviewUrl(profile.photoURL);
        }
      } catch (err) {
        console.error("Could not fetch profile", err);
      }
    });
    return () => unsubscribe();
  }, []);

  const [status, setStatus] = useState({ msg: "", type: "" });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  function handleFileSelect(e) {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    setFile(chosen);
    setPreviewUrl(URL.createObjectURL(chosen));
  }

  // → One handleSave (you had two, so we removed the stub)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const resp = await updateProfile({
        file,
        username: form.username,
        email: form.email,
      });
      if (resp.photoURL) setPreviewUrl(resp.photoURL);
      setStatus({ msg: "Profile saved!", type: "success" });
    } catch (err) {
      console.error(err);
      setStatus({ msg: "Failed to save profile", type: "error" });
    }
  };

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="user-profile-layout">

      <Sidebar user={user} />

      <div className="profile-content">
        <div className="profile-container">
          <form className="profile-form" onSubmit={handleSave}>

            <div className="welcome-section">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div
                className="avatar-wrapper"
                onClick={() => fileInputRef.current.click()}
                title="Click to change avatar"
              >
                <img
                  src={previewUrl || defaultAvatar}
                  alt="avatar"
                  className="profile-picture"
                />
              </div>
              <div className="user-profile-content">
                <h1>Welcome, {user.displayName || "User"}!</h1>
                <p>You've successfully logged in.</p>

              </div>

            </div>



            <div className="form-layout">
              <section className="profile-section">
                <h2 className="section-title">Personal Information</h2>
                <label>
                  Username
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Account Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </label>

              </section>

              <div className="save-row">
                <button type="submit" className="save-button">
                  Save Profile
                </button>

                {status.msg && (
                  <div className={status.type === "success" ? "status-success" : "status-error"}>
                    {status.msg}
                  </div>
                )}
              </div>
            </div>

            <div className="form-layout">
              <p>You can start by creating a resume or tailoring a resume!</p>
              <div className="button-row">
                <Link to="/createResume" className="button">
                  Create Resume
                </Link>
                <Link to="/tailorResume" className="button">
                  Tailor Resume
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

