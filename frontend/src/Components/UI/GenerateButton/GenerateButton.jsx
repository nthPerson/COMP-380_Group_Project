// src/components/UI/GenerateButton/GenerateButton.jsx
import React from "react";
import "./GenerateButton.css";

export default function GenerateButton({
  onClick,
  disabled,
  isGenerating,
  pulse,           
}) {
  // only add `.pulse` when pulse===true so this button pulses before it is clicked, after click it no pulse
  return (
    <div className={`generate-box ${pulse ? "pulse" : ""}`}>
      <button
        className="generate-button"
        onClick={onClick}
        disabled={disabled}
      >
        {isGenerating ? "Generating…" : "Generate Targeted Resume"}
      </button>
    </div>
  );
}
