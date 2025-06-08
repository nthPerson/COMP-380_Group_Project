/*
This file handles all resume-related API calls
*/
import { auth } from "../firebase";

// Get all PDFs for the current user
export const listUserPdfs = async () => {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/list_pdfs", {  // Calls the backend API
    headers: { Authorization: `Bearer ${idToken}` },
  });
    if (!res.ok) throw new Error("Failed to fetch PDF list");
    return await res.json();
};

// Delete a PDF by docID (the document ID stored in Firestore)
export const deleteUserPdf = async (docId) => {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/delete_pdf", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ docId }),
  });
  if (!res.ok) throw new Error("Failed to delete PDF");
  return await res.json();
};

// Set master resume by docID
export const setMasterPdf = async (docId) => {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/set_master_pdf", {
        method: "POST",
        headers: {
            Authorization: 'Bearer ${idToken}',
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ docId })
    });
    if (!res.ok) throw new Error("Failed to set master resume");
    return await res.json();
};

// Need to implement a frontend function for the get_master_pdf function

