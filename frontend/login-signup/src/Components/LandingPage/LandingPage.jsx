import React from 'react';
import { Link } from 'react-router-dom';
import logo_icon    from '../Assets/logo_icon.png';
//import './Homepage.css';

export default function LandingPage() {
  return (
    <>
      <header className="site-banner">
        <div className="banner-content">
          <img src={logo_icon} alt="Logo icon" /> {/* Image for email icon */}
          <nav className="banner-nav">
            <ul>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="landing-container">
        <h1>Welcome to Our App!</h1>
      </div>
    </>
  );
}
