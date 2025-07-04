import React from "react";
import { usePdf } from "../../PdfContext";
import UploadFileButton from "../../UI/UploadFileBox/UploadFileBox";

function UploadPdf() {
  const { uploadPdf } = usePdf();

  const handleUpload = async (file) => {
    if (!file) return;
    await uploadPdf(file);
  };

  return (
    <UploadFileButton onUpload={handleUpload} accept="application/pdf" />
  );
}

export default UploadPdf;