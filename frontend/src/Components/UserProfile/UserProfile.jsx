import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import Sidebar from "../Sidebar/Sidebar";
import "../Sidebar/Sidebar.css";
import "./UserProfile.css";

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
    <div className="user-profile-layout">
      <Sidebar user={user} />
      <div className="user-profile-content">
        <h1>Hello, {user.displayName || "User"}!</h1>
        <p>Welcome to your profile page!</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
