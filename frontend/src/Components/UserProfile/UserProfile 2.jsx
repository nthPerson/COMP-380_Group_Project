import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; 
import Sidebar from "../Sidebar/Sidebar";
import "../Sidebar/Sidebar.css";
import "./UserProfile.css"


const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="user-profile-page">
      <div>
        <Sidebar user={user} />
        <div className="user-profile">
          <h1>Welcome, {user.displayName || "User"}!</h1>
          <p>You've been successfully logged in. Start tailoring your resume!</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;