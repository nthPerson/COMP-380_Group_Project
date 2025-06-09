import React, { useState } from "react";
import { auth } from "../../firebase";
import { usePdf } from "../PdfContext";  // PdfContext (makes PDF utilities available to rest of app)

function UploadPdf() {
  const [file, setFile] = useState(null);
  const { fetchPdfsAndMaster, setStatusMessage } = usePdf();

  const handleUpload = async () => {
    if (!file) return;  // If the button is clicked without a file selected, do nothing
    const idToken = await auth.currentUser.getIdToken();  // Get authorization token from Firebase Auth

    const formData = new FormData();  // Create new FormData object to facilitate file transfer
    formData.append("file", file);  // Add the chosen file to the FormData object

    await fetch("http://localhost:5001/api/upload_pdf", {  // Call upload_user_pdf from backend/pdf_utils.py
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },  // Send the user's auth token along with the request for authentication
      body: formData,  // This is where the file is actually sent to the backend (in the body of the HTTP POST request)
    });

    setFile(null);  // Reset for the next request
    setStatusMessage("PDF uploaded successfully!");
    fetchPdfsAndMaster();  // Refresh the list of user pdfs and selected master
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadPdf;