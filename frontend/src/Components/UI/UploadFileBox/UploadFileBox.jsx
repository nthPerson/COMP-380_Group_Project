import React, { useState, useRef } from "react";
import "./UploadFileBox.css";
import "../../Pages/UserProfile/UserProfile.css";

export default function UploadFileButton({ onUpload, accept = "*" }) {
  const [file, setFile] = useState(null);
  const [highlight, setHighlight] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setHighlight(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setHighlight(true);
  };

  const handleDragLeave = () => {
    setHighlight(false);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleZoneClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleUploadClick = () => {
    if (file && onUpload) {
      onUpload(file);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="upload-file-button">
      <input
        type="file"
        accept={accept}
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <div
        className={`drop-zone ${highlight ? "highlight" : ""}`}
        onClick={handleZoneClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {file ? file.name : "Upload PDF or drag & drop"}
      </div>
      <button className="save-button upload-btn" onClick={handleUploadClick} disabled={!file}>
        Upload
      </button>
    </div>
  );
}