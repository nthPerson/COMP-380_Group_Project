import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const handleSignout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    throw err;
  }
};

//sign up handler with gets called in LoginSignUp.jsx
//uses default firebase login method from above
export const handleSignup = async (fullName, email, password) => {
  if (!fullName || !email || !password) {
    const err = new Error('All fields are required');
    err.code = 'empty-fields';
    throw err;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: fullName });

    return user; 
  } catch (err) {
    throw err;
  }
};

//login handler which gets called in LoginOnly.jsx
//uses default firebase login method from above 
export const handleLogin = async (email, password) => {
    // added empty fields check to remove unncecsary calls to firebase
  if (!email || !password) {
    const err = new Error('Please enter both email and password.');
    err.code = 'empty-fields';
    throw err;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    throw err;
  }
};


//reset password handler which gets called in LoginOnly.jsx
//uses default firebase reset password method from above
export const handlePasswordReset = async (email) => {
    // added empty fields check to remove unncecsary calls to firebase
  if (!email) {
    const err = new Error('Please enter your email.');
    err.code = 'empty-email';
    throw err;
  }
  //check for valid email with regex 
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValidEmail) {
    const err = new Error('Invalid email format.');
    err.code = 'invalid-email-format';
    throw err;
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw err;
  }
};


