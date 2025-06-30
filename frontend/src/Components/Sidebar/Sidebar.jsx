import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { handleSignout } from '../../services/authHandlers';

import logo_icon from "../Assets/logo_icon.png";
// import profile_icon from "../Assets/profile_icon.png";
import archive_icon from "../Assets/library_icon.png";
import magicwand_icon from "../Assets/magic-wand_icon.png";
import resume_icon from "../Assets/resume_icon.png"; // Added new icon for "Create Resume"
import logout_icon from "../Assets/logout_icon.png";

function NavLink({ to, icon, children }) {
  return (
    <Link to={to} className="sidebar-link">
      <img src={icon} alt="" aria-hidden="true" />
      <span>{children}</span>
    </Link>
  );
}

function Sidebar({ user }) {
  const navigate = useNavigate();
  const [tailorOpen, setTailorOpen] = useState(false);

  const handleSignOut = async () => {
    await handleSignOut();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* ──────────── Logo / Header ──────────── */}
      <Link to="/landingPage" className="sidebar-header">
        <img src={logo_icon} alt="RezuMe logo" className="sidebar-logo" />
        <span className="sidebar-title">
          <span className="light-blue">Rezu</span>
          <span className="solid-blue">Me</span>
        </span>
      </Link>

      {/* ──────────── Navigation list ──────────── */}
      <nav aria-label="Main">
        <ul className="sidebar-list">

          {/* Welcome */}
          <li><NavLink to="/welcome" icon={logo_icon}>Welcome</NavLink></li>

          {/* Create Resume */}
          <li><NavLink to="/createResume" icon={resume_icon}>Create&nbsp;Resume</NavLink></li>

          {/* Tailor Resume – expandable item */}
          <li className="sidebar-item">
            <button
              type="button"
              className="sidebar-link"
              onClick={() => setTailorOpen(!tailorOpen)}
              aria-expanded={tailorOpen}
              aria-controls="tailor-subnav"
            >
              <img src={magicwand_icon} alt="" aria-hidden="true" />
              <span>Tailor&nbsp;Resume</span>
              <span className="chevron">{tailorOpen ? "▾" : "▸"}</span>
            </button>

            {tailorOpen && (
              <ul id="tailor-subnav" className="subnav">
                <li><NavLink to="/uploadResume"      icon={resume_icon}>Upload&nbsp;Resume</NavLink></li>
                <li><NavLink to="/addJobDescription" icon={magicwand_icon}>Add&nbsp;Job&nbsp;Description</NavLink></li>
                <li><NavLink to="/selectKeywords"    icon={magicwand_icon}>Select&nbsp;Keywords</NavLink></li>
                <li><NavLink to="/generateEditResume"icon={magicwand_icon}>Generate&nbsp;&amp;&nbsp;Edit</NavLink></li>
              </ul>
            )}
          </li>

          {/* Resume Archive */}
          <li><NavLink to="/resumeArchive" icon={archive_icon}>Resume&nbsp;Archive</NavLink></li>

          {/* Logout */}
          <li>
            <button type="button" className="sidebar-link" onClick={handleSignOut}>
              <img src={logout_icon} alt="" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );

}

export default Sidebar;


// const Sidebar = ({ user }) => {
//   const navigate = useNavigate();

//   const onClick = async () => {
//     await handleSignout();
//     navigate("/");
//   };


//   return (
//     <div className="sidebar">
//       <Link to="/landingPage" className="sidebar-header">
//         <img src={logo_icon} alt="Logo" className="sidebar-logo" />
//         <div className="sidebar-title">
//           <span className="light-blue">Rezu</span>
//           <span className="solid-blue">Me</span>
//         </div>
//       </Link>

//       <nav className="sidebar-nav">
//         <ul>

//           {/* Welcome page */}
//           <li>
//             <Link to="/welcome" className="sidebar-link">
//               <img src={logo_icon} alt="Welcome icon" />
//               <span>Welcome</span>
//             </Link>
//           </li>


//           {/* Create Resume */}
//           <li>
//             <Link to="/createResume" className="sidebar-link">
//               <img src={resume_icon} alt="Resume icon" />
//               <span>Create Resume</span>
//             </Link>
//           </li>

//           {/* Tailor Resume
//           <li>
//             <Link to="/tailorResume" className="sidebar-link">
//               <img src={magicwand_icon} alt="Tailor icon" />
//               <span>Tailor Resume</span>
//             </Link>
//           </li> */}

//           {/* Tailor Resume Workflow */}
//           <li>
//             <div className="sidebar-link">
//               <img src={magicwand_icon} alt="Tailor icon" />
//               <span>Tailor Resume</span>
//             </div>
//             <ul className="subnav">
//               <li>
//                 <Link to="/uploadResume" className="sidebar-sublink">Upload Resume</Link>
//               </li>
//               <li>
//                 <Link to="/addJobDescription" className="sidebar-sublink">Add Job Description</Link>
//               </li>
//               <li>
//                 <Link to="/selectKeywords" className="sidebar-sublink">Select Keywords</Link>
//               </li>
//               <li>
//                 <Link to="/generateEditResume" className="sidebar-sublink">Generate &amp; Edit</Link>
//               </li>
//             </ul>
//           </li>

//           {/* Resume Archive */}
//           <li>
//             <Link to="/resumeArchive" className="sidebar-link">
//               <img src={archive_icon} alt="Archive icon" />
//               <span>Resume Archive</span>
//             </Link>
//           </li>
//           <li>
//             <button type="button" className="sidebar-link" onClick={onClick} style={{background: "none", border: "none", alignItems: "center" }}>
//               <img src={logout_icon} alt="Log Out icon" />
//               <span>Logout</span>
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };
