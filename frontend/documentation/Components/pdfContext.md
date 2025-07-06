# PdfContext.jsx

## Overview
This file implements a **React Context and Provider** for managing user resume PDFs in the RezuMe app. It centralizes state and functionality related to uploading, listing, deleting, setting, and refreshing resumes, as well as managing the master resume. It listens to Firebase authentication state changes so that resume data is only fetched when a user is authenticated. Components in the app can use the `usePdf()` custom hook to access these shared functions and state.

---

## Core Concepts
- **PdfContext**: provides a centralized state for resumes across the app.
- **PdfProvider**: wraps the entire app (in `App.js`) to make PDF-related data and methods available globally.
- **usePdf()**: a custom React hook for easily accessing the context.

---

## Provided Values

The context exposes these states and functions to any component consuming `usePdf()`:

- **pdfs**: current list of user-uploaded resumes.
- **masterDocID**: ID of the selected master resume.
- **loading**: boolean indicating if resumes are currently being fetched.
- **statusMessage**: latest status message (e.g., upload success or error).
- **setStatusMessage**: function to update `statusMessage`.
- **fetchPdfsAndMaster()**: fetch both the list of PDFs and the master resume ID.
- **fetchPdfs()**: fetch only the list of user resumes.
- **fetchMasterdocID()**: fetch the master resume ID directly from the backend.
- **uploadPdf(file)**: upload a new resume file; automatically refreshes PDF list afterward.
- **handleDelete(docID, fileName)**: delete a PDF by document ID and refresh list.
- **handleSetMaster(docID, fileName)**: set a given PDF as the master resume.
- **extractKeywordsFromMaster()**: call backend API to extract keywords from the current master resume.

---

## Key Functions

### fetchPdfsAndMaster
- Fetches both the user’s list of resumes and the current master resume ID.
- Updates `pdfs` and `masterDocID` states.

### fetchPdfs
- Fetches only the list of user resumes and updates `pdfs`.

### fetchMasterdocID
- Makes an authenticated API call to `/api/get_master_pdf` to retrieve the master document ID.

### uploadPdf
- Uploads a new resume file via `/api/upload_pdf`.
- Accepts a `File` object, uses `FormData` to send it, and updates resume state after upload.

### handleDelete
- Deletes a resume by document ID using `deleteUserPdf()`.
- Refreshes PDF list after deletion.

### handleSetMaster
- Sets a resume as the master resume by document ID using `setMasterPdf()`.
- Refreshes PDF list after setting master.

### extractKeywordsFromMaster
- Sends a POST request with `masterDocID` to `/api/extract_keywords` to extract keywords from the selected master resume.
- Updates `statusMessage` with success or failure feedback.

---

## useEffect: Auth Subscription
- Subscribes to `onIdTokenChanged()` from Firebase Auth.
- On login: fetches PDFs and master resume.
- On logout: clears `pdfs` and `masterDocID` state.

---

## Context Usage

### Providing the Context
```jsx
<PdfProvider>
  <App />
</PdfProvider>
