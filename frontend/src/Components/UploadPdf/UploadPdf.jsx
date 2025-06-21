import React, { useState } from "react";
import { usePdf } from "../PdfContext";  // Centralized location for all PDF logic in frontend

function UploadPdf() {
  const [file, setFile] = useState(null);
  const { uploadPdf } = usePdf();  // Get uploadPdf function from PdfContext.js

  const handleUpload = async () => {
    if (!file) return;
    await uploadPdf(file);
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
