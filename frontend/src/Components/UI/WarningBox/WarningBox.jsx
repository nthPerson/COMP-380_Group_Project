import React from "react";
import "./WarningBox.css";

export default function WarningBox({ children }) {
  return (
    <div className="warning-box">
      <p className="warning-box__message">{children}</p>
    </div>
  );
}
