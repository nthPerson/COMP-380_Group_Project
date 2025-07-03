import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleSignout } from '../../services/authHandlers';

import logo_icon from "../Assets/logo_icon.png";
import profile_icon from "../Assets/profile_icon.png";
import archive_icon from "../Assets/library_icon.png";
import magicwand_icon from "../Assets/magic-wand_icon.png";
import resume_icon from "../Assets/resume_icon.png";
import logout_icon from "../Assets/logout_icon.png";
import welcome_icon from "../Assets/hello.png";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Close mobile menu on resize to desktop
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Separate useEffect for initial screen size setup
  useEffect(() => {
    const initialSetup = () => {
      // Auto-collapse on smaller screens only on initial load
      if (window.innerWidth <= 1024 && window.innerWidth > 768) {
        setIsCollapsed(true);
      } else if (window.innerWidth > 1024) {
        setIsCollapsed(false);
      }
    };

    initialSetup();
  }, []); // Empty dependency array means this runs only once on mount

  // Add/remove body classes to adjust main content margin
  useEffect(() => {
    const body = document.body;
    
    // Remove all sidebar classes first
    body.classList.remove('sidebar-open', 'sidebar-collapsed');
    
    if (isMobile) {
      // On mobile, no margin adjustments needed
      return;
    } else {
      // On desktop, adjust margins based on sidebar state
      if (isCollapsed) {
        body.classList.add('sidebar-collapsed');
      } else {
        body.classList.add('sidebar-open');
      }
    }

    // Cleanup on unmount
    return () => {
      body.classList.remove('sidebar-open', 'sidebar-collapsed');
    };
  }, [isCollapsed, isMobile]);

  const handleSignOut = async () => {
    await handleSignout();
    navigate("/");
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
      // Close dropdown when collapsing
      if (!isCollapsed) {
        setDropdownOpen(false);
      }
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.nav-item-with-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Determine sidebar classes
  const getSidebarClasses = () => {
    let classes = 'sidebar';
    
    if (isMobile) {
      classes += ' mobile';
      if (isMobileOpen) {
        classes += ' mobile-open';
      }
    } else {
      if (isCollapsed) {
        classes += ' collapsed';
      }
    }
    
    return classes;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
          onClick={closeMobileSidebar}
        />
      )}
      
      {/* Mobile menu button */}
      {isMobile && (
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          ☰
        </button>
      )}

      <div className={getSidebarClasses()}>
        {/* Toggle button for desktop */}
        {!isMobile && (
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? '☰' : '☰'}
          </button>
        )}

        {/* Close button for mobile */}
        {isMobile && (
          <button 
            className="sidebar-close" 
            onClick={closeMobileSidebar}
            aria-label="Close menu"
          >
            ×
          </button>
        )}

        <Link to="/landingPage" className="sidebar-header">
          <img src={logo_icon} alt="RezuMe Logo" className="sidebar-logo" />
          <div className="sidebar-title">
            <span className="light-blue">Rezu</span>
            <span className="solid-blue">Me</span>
          </div>
        </Link>

        <nav className="sidebar-nav">
          <ul>
            {/* Welcome page */}
            <li>
              <Link 
                to="/welcome" 
                className="sidebar-link" 
                title="Welcome"
                onClick={isMobile ? closeMobileSidebar : undefined}
              >
                <img src={welcome_icon} alt="Welcome icon" />
                <span className="nav-text">Welcome</span>
              </Link>
            </li>

            {/* Create Resume */}
            <li>
              <Link 
                to="/createResume" 
                className="sidebar-link" 
                title="Create Resume"
                onClick={isMobile ? closeMobileSidebar : undefined}
              >
                <img src={resume_icon} alt="Resume icon" />
                <span className="nav-text">Create Resume</span>
              </Link>
            </li>

            {/* Tailor Resume Workflow with Dropdown */}
            <li className={`nav-item-with-dropdown ${dropdownOpen ? 'open' : ''}`}>
              <button 
                className="sidebar-link has-dropdown" 
                title="Tailor Resume"
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <img src={magicwand_icon} alt="Tailor icon" />
                <span className="nav-text">Tailor Resume</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              <ul className="subnav">
                <li>
                  <Link 
                    to="/uploadResume" 
                    className="sidebar-sublink" 
                    title="Upload Resume"
                    onClick={isMobile ? closeMobileSidebar : undefined}
                  >
                    <span className="subnav-text">Upload Resume</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/addJobDescription" 
                    className="sidebar-sublink" 
                    title="Add Job Description"
                    onClick={isMobile ? closeMobileSidebar : undefined}
                  >
                    <span className="subnav-text">Add Job Description</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/selectKeywords" 
                    className="sidebar-sublink" 
                    title="Select Keywords"
                    onClick={isMobile ? closeMobileSidebar : undefined}
                  >
                    <span className="subnav-text">Select Keywords</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/generateEditResume" 
                    className="sidebar-sublink" 
                    title="Generate & Edit"
                    onClick={isMobile ? closeMobileSidebar : undefined}
                  >
                    <span className="subnav-text">Generate & Edit</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Resume Archive */}
            <li>
              <Link 
                to="/resumeArchive" 
                className="sidebar-link" 
                title="Resume Archive"
                onClick={isMobile ? closeMobileSidebar : undefined}
              >
                <img src={archive_icon} alt="Archive icon" />
                <span className="nav-text">Resume Archive</span>
              </Link>
            </li>

            {/* Logout */}
            <li>
              <button 
                type="button" 
                className="sidebar-link" 
                onClick={handleSignOut} 
                title="Logout"
                style={{
                  background: "none", 
                  border: "none", 
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  font: "inherit"
                }}
              >
                <img src={logout_icon} alt="Log Out icon" />
                <span className="nav-text">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
export default Sidebar;