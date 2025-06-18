// src/Components/Sidebar/Sidebar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo_icon from '../Assets/logo_icon.png';
import profile_icon from "../Assets/profile_icon.png";
import archive_icon from '../Assets/library_icon.png';
import magicwand_icon from "../Assets/magic-wand_icon.png";
import logout_icon from "../Assets/logout_icon.png";

const Sidebar = ({ user }) => (
  <div className="sidebar">
    {/* Logo and Title at the Top */}
    <Link to="/landingPage" style={{ textDecoration: "none" }}>
    <div className="sidebar-header" style={{ marginBottom: "2rem", textAlign: "center" }}>
      <img src={logo_icon} alt="Logo icon" className="sidebar-logo" style={{ width: "60px" }} />
      <div className="sidebar-title" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
        <span className="light-blue">Rezu</span>
        <span className="solid-blue">Me</span>
      </div>
    </div>
    </Link>
    {/* Navigation */}
    <nav className="sidebar-nav">
      <ul>
        <li>
          <Link to="/userProfile" className="profile-link">
            <img src={profile_icon} alt="Profile icon" />
            <span>{user?.displayName || "User"}'s Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/tailorResume" className="tailor-link">
            <img src= {magicwand_icon} alt="Tailor icon" />
            <span>Tailor Resume</span>
            </Link>
        </li>
        <li>
          <Link to="/resumeArchive" className="archive-link">
            <img src= {archive_icon} alt="File icon" />
            <span>Resume Archive</span>
            </Link>
        </li>
        <li>
          <Link to="/logoutButton" className="logout-link">
            <img src= {logout_icon} alt="Logout button" />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
