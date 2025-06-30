import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleSignout } from '../../services/authHandlers';

import logo_icon from "../Assets/logo_icon.png";
import profile_icon from "../Assets/profile_icon.png";
import archive_icon from "../Assets/library_icon.png";
import magicwand_icon from "../Assets/magic-wand_icon.png";
import resume_icon from "../Assets/resume_icon.png"; // Added new icon for "Create Resume"
import logout_icon from "../Assets/logout_icon.png";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const onClick = async () => {
    await handleSignout();
    navigate("/login");
  };

  return (
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

          {/* Welcome page */}
          <li>
            <Link to="/welcome" className="sidebar-link">
              <img src={logo_icon} alt="Welcome icon" />
              <span>Welcome</span>
            </Link>
          </li>


          {/* Create Resume */}
          <li>
            <Link to="/createResume" className="sidebar-link">
              <img src={resume_icon} alt="Resume icon" />
              <span>Create Resume</span>
            </Link>
          </li>

          {/* Tailor Resume */}
          <li>
            <Link to="/tailorResume" className="sidebar-link">
              <img src={magicwand_icon} alt="Tailor icon" />
              <span>Tailor Resume</span>
            </Link>
          </li>

          {/* Resume Archive */}
          <li>
            <Link to="/resumeArchive" className="sidebar-link">
              <img src={archive_icon} alt="Archive icon" />
              <span>Resume Archive</span>
            </Link>
          </li>
          <li>
            <button type="button" className="sidebar-link" onClick={onClick} style={{background: "none", border: "none", alignItems: "center" }}>
              <img src={logout_icon} alt="Log Out icon" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Sidebar;