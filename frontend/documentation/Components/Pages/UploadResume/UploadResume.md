# UploadResume.jsx

## Overview
This React component renders the **Upload Resume** page of the application. It allows authenticated users to upload resumes (PDF or DOCX), manage them in their resume library, select a “master resume” for tailoring, and navigate to the next step in the workflow.  
It relies on Firebase Authentication for user access, listens for authentication state changes, fetches user resume data, and uses multiple child components to organize UI and functionality.

---

## How This Component Works
- Uses React state to store the current authenticated user.
- Uses `onAuthStateChanged` from Firebase to listen for auth status changes and update `user` state accordingly.
- Uses `useEffect` to:
  - Subscribe to auth state changes on mount and clean up on unmount.
  - Fetch the user’s resume PDFs and master resume info once the component loads.
- Redirects to the homepage after signing out.
- Displays a loading spinner if the user is not yet authenticated.
- Once authenticated, renders the upload UI, info boxes, resume library, and a navigation button to proceed.

---

## State Variables
- **user**: holds the currently authenticated Firebase user object.

---

## Hooks
- **useNavigate**: handles programmatic navigation.
- **usePdf**: context hook providing `fetchPdfsAndMaster` (fetches resume PDFs and master selection) and `masterDocID` (ID of the current master resume).

---

## useEffect Hooks
- **Auth Subscription**
  - Subscribes to Firebase auth state via `onAuthStateChanged`.
  - Updates `user` state whenever auth state changes.
  - Cleans up the listener on unmount.
- **Initial Data Fetch**
  - Runs once on mount to call `fetchPdfsAndMaster()`, refreshing the resume list and master info.

---

## handleSignOut
- **Purpose**: Signs the user out using Firebase Auth’s `signOut` method.
- **Side Effects**: Navigates to the homepage (`/`) and replaces the current history entry to prevent back-navigation after logout.

---

## Rendered Elements

- **Loading State**
  - Renders a loading spinner and text when `user` is `null` (waiting for auth).

- **Main Layout**
  - `<Sidebar user={user} />`: displays the application sidebar with user info and navigation links.
  - **Header**
    - Page title: “Upload Resume”.
    - `<InfoBox>`: component displaying informational tips about uploading and selecting the master resume.
  - **Upload Section**
    - `<UploadPdf>`: component for uploading resumes.
    - `<ResumeLibrary>`: shows uploaded resumes in a library view; configured to show uploaded resumes (`showUploaded={true}`) and hide generated resumes (`showGenerated={false}`).
    - Paragraph with note explaining the importance of the master resume.
  - **Navigation**
    - `<NavigationButton>`: proceeds to `/addJobDescription`; disabled if no master resume has been selected (i.e., `!masterDocID`).

---

## Child Components Used
- **Sidebar**: displays user navigation and profile info.
- **UploadPdf**: handles uploading resumes.
- **ResumeLibrary**: shows a list of uploaded resumes and allows selection of a master resume.
- **InfoBox**: renders informational messages in a styled box.
- **NavigationButton**: styled button component for navigation (uses React Router’s `Link`).

---

## External Dependencies
- **React**: component state and lifecycle hooks.
- **firebase/auth**: `onAuthStateChanged`, `auth.signOut`.
- **react-router-dom**: `useNavigate`, `Link`.
- **PdfContext**: custom context providing resume PDF management functions and state.
- **AOS (Animate On Scroll)**: animation library, inferred by `data-aos="fade-up"` attribute (library must be initialized elsewhere).
- **CSS**: `Sidebar.css` and `TailorResume.css` for page styling.
