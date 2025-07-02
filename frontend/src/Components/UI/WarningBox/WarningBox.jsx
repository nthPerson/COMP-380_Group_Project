import React from "react";
import "./WarningBox.css";

export default function WarningBox({ title, children }) {
  return (
    <div className="warning-box">
      {title && <h2 className="warning-box__title">{title}</h2>}
      <p className="warning-box__message">{children}</p>
    </div>
  );
}
