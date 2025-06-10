import React, { useState } from "react";
import { auth } from "../../firebase";

function UploadPdf() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const idToken = await auth.currentUser.getIdToken();

    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:5001/api/upload_pdf", {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
      body: formData,
    });

    setFile(null);
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