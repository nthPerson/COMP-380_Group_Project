import React from 'react';
import { Link } from 'react-router-dom';
//import './LandingPage.css'; // Optional: style as you want

export default function LandingPage() {
  return (
    <>
      <header className="site-banner">
        <div className="banner-content">
          <img src="/logo.png" alt="Logo" className="banner-logo" />
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
