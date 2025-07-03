import React from "react";
import { Link } from "react-router-dom";
import "./NavigationButton.css";

/**
 * Reusable navigation component that wraps React Router’s Link
 * so navigation links share a common style.
 */
export default function NavigationButton({ to, children, disabled = false }) {
  const className = `navigation-button ${disabled ? "disabled" : ""}`;
  return (
    <Link to={disabled ? "#" : to} className={className} aria-disabled={disabled}
    tabIndex={disabled ? -1 : 0}>
      {children}
    </Link>
  );
}
