import React from "react";
import { Link } from "react-router-dom";
import logo_icon from "../Assets/logo_icon.png";
import profile_icon from "../Assets/profile_icon.png";
import archive_icon from "../Assets/library_icon.png";
import magicwand_icon from "../Assets/magic-wand_icon.png";

const Sidebar = ({ user }) => (
  <div className="sidebar">
    <Link to="/landingPage" className="sidebar-header">
      <img src={logo_icon} alt="Logo" className="sidebar-logo" />
      <div className="sidebar-title">
        <span className="light-blue">Rezu</span>
        <span className="solid-blue">Me</span>
      </div>
    </Link>

    <nav className="sidebar-nav">
      <ul>
        <li>
          <Link to="/userProfile" className="sidebar-link">
            <img src={profile_icon} alt="Profile icon" />
            <span>{user?.displayName || "User"}'s Profile</span>
          </Link>
        </li>
        <li>
          <Link to="/tailorResume" className="sidebar-link">
            <img src={magicwand_icon} alt="Tailor icon" />
            <span>Tailor Resume</span>
          </Link>
        </li>
        <li>
          <Link to="/resumeArchive" className="sidebar-link">
            <img src={archive_icon} alt="Archive icon" />
            <span>Resume Archive</span>
          </Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;
