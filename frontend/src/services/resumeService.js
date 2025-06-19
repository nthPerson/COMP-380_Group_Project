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

// Delete a PDF by docID(the document ID stored in Firestore)
export const deleteUserPdf = async (docID) => {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/delete_pdf", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ docID }),
  });
  if (!res.ok) throw new Error("Failed to delete PDF");
  return await res.json();
};

// Set master resume by docID
export const setMasterPdf = async (docID) => {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/set_master_pdf", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID })
    });
    if (!res.ok) throw new Error("Failed to set master resume");
    return await res.json();
};

// Fetch user's master resume master_docID
export const getMasterPdf = async () => {
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5001/api/get_master_pdf", {
        headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) throw new Error("Failed to get master resume");
    return await res.json(); // should return { master_docId: ... }
};

// Extract resume profile (skills, education, professional experience) from user's master resume (OpenAI API)
export async function extractResumeProfileLLM(docID) {
  const idToken = await auth.currentUser.getIdToken();
  const res = await fetch("http://localhost:5001/api/extract_resume_profile_llm", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ docID }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();  // Returns JSON: { skills: [...], education: [...], experience: [...] }
}

// Save a new resume to the backend
export const saveResume = async (resumeData) => {
  try {
    const idToken = await auth.currentUser.getIdToken(); // Get the user's authentication token
    const response = await fetch("http://localhost:5001/api/save_resume", { // Backend API endpoint
      method: "POST", // HTTP POST method
      headers: {
        Authorization: `Bearer ${idToken}`, // Pass the user's token for authentication
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify(resumeData), // Convert resume data to JSON
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse error response
      throw new Error(errorData.error || "Failed to save resume"); // Throw an error if the request fails
    }

    const data = await response.json(); // Parse the successful response
    return data; // Return the response data
  } catch (error) {
    console.error("Error saving resume:", error); // Log the error for debugging
    throw error; // Re-throw the error for the caller to handle
  }
};
