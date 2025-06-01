// src/Components/Homepage/Homepage.jsx

import React, { useState, useEffect } from 'react';
// import the auth and change on to track 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Homepage() {
    // local state to store the current Firebase user
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); //update the user with the current user with the onAuthStateChanged to change the current user to the current one
    });
  // clean up the listener when the component clears
    return () => unsubscribe(); 
  }, []);

  return (
    <div style={{
      maxWidth: 400,
      margin: '4rem auto',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
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
  );
}
