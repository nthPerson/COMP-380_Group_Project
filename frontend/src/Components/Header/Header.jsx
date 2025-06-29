import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { getProfile } from "../../services/profileService";
import "./Header.css";
import defaultAvatar from "../Assets/blank-avatar.png";

export default function Header() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ username: "", photoURL: "" });

  // 1) Wait for auth, then load Firestore profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const p = await getProfile();
          setProfile({
            username: p.username || fbUser.displayName || "User",
            photoURL: p.photoURL || defaultAvatar,
          });
        } catch (e) {
          console.error("Header: could not fetch profile", e);
        }
      }
    });
    return () => unsub();
  }, []);

  if (!user) return null;  // nothing to show if not logged in

  return (
    <header className="app-header">
      <Link to="/userProfile" className="profile-link">
        <img
          src={profile.photoURL}
          alt="avatar"
          className="header-avatar"
        />
        <span className="header-username">{profile.username}</span>
      </Link>
    </header>
  );
}
