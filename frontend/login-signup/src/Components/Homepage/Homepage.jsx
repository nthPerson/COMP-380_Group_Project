import React, { useState, useEffect } from 'react';
// import the auth and change on to track 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';

import LoginOnly from '../LoginOnly/LoginOnly';           
import LoginSignup from '../LoginSignup/LoginSignup';
import './Homepage.css';

export default function Homepage() {
  // State for the current Firebase user
  const [user, setUser] = useState(null);
  // State for toggling the mobile nav (hamburger)
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
      // clean up the listener when the component clears
      return () => unsubscribe(); 
  }, []);

  return (
    <>
      {/* ─── HEADER / BANNER WITH HAMBURGER ─── */}
      <header className={`site-banner ${navOpen ? 'nav-open' : ''}`}>
        <div className="banner-content">
          {/* Logo */}
          <img src="/logo.png" alt="Logo" className="banner-logo" />

          {/* Navigation links */}
          <nav className="banner-nav">
            <ul>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="homepage-container">
        {user ? (
          <>
            <h1>Welcome, {user.displayName || 'User'}!</h1>
            <p>You are now logged in and on the Home page.</p>
            <p>Email: {user.email}</p>
          </>
        ) : (
          <p>Loading user...</p>
        )}
      </div>
    </>
  );
}

