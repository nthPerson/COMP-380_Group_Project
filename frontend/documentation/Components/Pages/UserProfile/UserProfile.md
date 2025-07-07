# UserProfile.jsx

## Overview
This React component renders the **User Profile** page, allowing authenticated users to view and update their personal profile information, including username, email, and profile picture. It uses Firebase Authentication to load the currently signed-in user and Firestore (via `profileService`) to fetch and save profile details. The page includes an interactive avatar uploader, a profile information form, and quick navigation buttons to start creating or tailoring a resume.

---

## How This Component Works
- Uses Firebase’s `onAuthStateChanged` to detect the current authenticated user on mount.
- Fetches the user’s saved profile information from Firestore through `getProfile()`.
- Prefills the profile form with the authenticated user’s email and Firestore-stored username and email.
- Displays the current or default avatar and allows changing the profile picture.
- Saves profile updates (including image upload) using `updateProfile()`.
- Shows status messages after save attempts.
- Provides links to proceed to the Create Resume or Tailor Resume pages.

---

## State Variables
- **user**: stores the authenticated Firebase user object.
- **file**: holds the currently selected avatar file (if any).
- **previewUrl**: URL of the image preview for the avatar.
- **form**: object containing `username` and `email` fields, representing the form state.
- **status**: object with `msg` (message) and `type` (success or error) indicating profile save outcomes.

---

## useEffect Hooks
- **Auth State & Profile Loading**
  - Subscribes to Firebase auth state on mount.
  - If the user is authenticated, sets the user and pre-fills the profile form with their email.
  - Fetches the saved profile from Firestore and updates the form fields and avatar preview if data exists.
  - Unsubscribes from the auth listener on unmount.

---

## Refs
- **fileInputRef**: reference to the hidden file input used for selecting a new avatar image when the avatar area is clicked.

---

## Functions

### handleChange
- **Purpose**: Updates the corresponding field in `form` state when the user types into a profile input.
- **Input**: `event` from the input change.
- **Side Effects**: Updates `username` or `email` in the form state.

### handleFileSelect
- **Purpose**: Triggered when a user selects a new avatar file; sets the selected file in state and generates a preview URL.
- **Input**: `event` from file selection.
- **Side Effects**: Updates `file` and `previewUrl`.

### handleSave
- **Purpose**: Called when the profile form is submitted. Saves profile data and profile picture to Firestore via `updateProfile()`.
- **Input**: `event` from form submission.
- **Side Effects**: Updates status messages, updates avatar preview if a new picture is uploaded.

---

## Rendered Elements

- **Sidebar**
  - `<Sidebar user={user} />`: displays navigation and user info.

- **Welcome Section**
  - Displays current avatar or default avatar.
  - Clicking avatar opens file picker.
  - Shows greeting with `user.displayName` or “User”.

- **Profile Form**
  - Username and email fields bound to `form` state.
  - Save button to submit changes.
  - Displays success or error messages after save attempts.

- **Navigation Buttons**
  - Two buttons linking to:
    - `/createResume` for starting resume creation.
    - `/uploadResume` for tailoring an existing resume.

- **Loading State**
  - Displays "Loading user profile..." while waiting for user authentication.

---

## Child Components Used
- **Sidebar**: provides navigation and user profile details.

---

## External Dependencies
- **React**: for state, lifecycle, and refs.
- **firebase/auth**: `onAuthStateChanged` for user authentication.
- **profileService.js**: `updateProfile()` and `getProfile()` for profile data management.
- **react-router-dom**: `Link` for navigation buttons.
- **AOS (Animate On Scroll)**: imported and initialized but not actively used in this file.
- **CSS**: `Sidebar.css` and `UserProfile.css` for layout and styling.
- **defaultAvatar**: fallback image if no profile picture exists.
