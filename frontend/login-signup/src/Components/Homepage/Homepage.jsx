import React, { useState, useEffect } from 'react';
// import the auth and change on to track 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';

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

