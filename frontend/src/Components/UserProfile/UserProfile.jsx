import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; 
import Sidebar from "../Sidebar/Sidebar";
import "../Sidebar/Sidebar.css";
import "./UserProfile.css"

import AOS from "aos";
import "aos/dist/aos.css";


const UserProfile = () => {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    phoneNumber: "",
    address: "",
    education: "",
    workExperience: "",
    skills: "",
    linkedin: "",
    github: "",
    portfolioUrl: "",
  });

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if(firebaseUser){
        setForm(f => ({...f, email: firebaseUser.email || ""}));
      }
    });
    return () => unsubscribe();
  }, []);
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = e => {
    e.preventDefault();
    console.log("Saving profile:", form);
    // TODO: send `form` to Firestore
  };

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

          <form className="profile-form" onSubmit={handleSave}>
          
            <div className="form-layout" data-aos="fade-up">
            <section className="profile-section">
              <h2 className="section-title">Personal Information</h2>
              <label>
                Address
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </label>
              <label>
                Phone number
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>
             
            </section>
            </div>

            <div className="form-layout" data-aos="fade-up">
              <section className="profile-section">
              <h2 className="section-title">Education</h2>
              <label>
                Education 1
                
              </label>
              </section>
            </div>

            <div className="form-layout" data-aos="fade-up">
              <section className="profile-section">
              <h2 className="section-title">Links </h2>
              <label>
                LinkedIn
                <input
                  typle="url"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedin}
                  onChange={handleChange}
                />
              </label>
              <label>
                GitHub
                <input
                  type="url"
                  name="github"
                  placeholder="https://github.com/..."
                  value={form.github}
                  onChange={handleChange}
                />

              </label>
              </section>
            </div>
            <button type="submit" className="save-btn">
            Save Profile
          </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;