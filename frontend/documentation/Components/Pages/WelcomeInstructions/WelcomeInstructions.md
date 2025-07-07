# WelcomeInstructions.jsx

## Overview
This React component renders the **Welcome Instructions** page for authenticated users, introducing them to the workflow of the RezuMe app. It lists step-by-step instructions for creating a tailored resume, greets the user by name, and provides quick-start buttons to either create a new resume or upload an existing one. Authentication status is handled with Firebase, and navigation options are implemented using React Router.

---

## How This Component Works
- Uses Firebase’s `onAuthStateChanged` to detect the current authenticated user.
- If authenticated, displays personalized welcome text, a list of steps outlining the resume-tailoring process, and navigation buttons.
- If no user is signed in yet, shows a loading message.

---

## State Variables
- **user**: stores the current authenticated user object.

---

## useEffect Hook
- Subscribes to Firebase authentication state on mount.
- Updates `user` state when the authenticated user changes.
- Cleans up the auth listener on component unmount.

---

## Rendered Elements

- **Loading State**
  - Displays “Loading…” while waiting for user authentication.

- **Main Layout**
  - `<Sidebar user={user} />`: renders the sidebar for app navigation and user profile info.

- **Header**
  - Personalized greeting with `user.displayName` (or “User” as fallback).
  - Subheading introducing the instructions.

- **Steps List**
  - Ordered list of steps defined in the `steps` array, with each step displaying a title and description:
    1. Upload Your Master Resume – upload a full resume for tailoring.
    2. Provide a Job Description – enter or paste job description text.
    3. Pick Keywords to Emphasize – select skills or terms to highlight.
    4. Generate Your Tailored RezuMe – create a custom resume.
    5. Review & Tweak – edit the generated resume.
    6. Export & Share – download or save the final resume.

- **Actions**
  - Two main buttons:
    - “Create RezuMe” → `/createResume`
    - “Upload Resume” → `/uploadResume`
  - Text “or” between buttons for clarity.

---

## Child Components Used
- **Sidebar**: displays navigation menu and user profile info.

---

## External Dependencies
- **React**: component state and lifecycle hooks.
- **firebase/auth**: `onAuthStateChanged` to monitor user authentication.
- **react-router-dom**: `Link` for navigation buttons.
- **CSS**: `Sidebar.css` and `WelcomeInstructions.css` for styling.
