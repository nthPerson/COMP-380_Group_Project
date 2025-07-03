import React from "react";
import { Link } from "react-router-dom";
import "./NavigationButton.css";

/**
 * Reusable navigation component that wraps React Router’s Link
 * so navigation links share a common style.
 */
export default function NavigationButton({ to, children }) {
  return (
    <Link to={to} className="navigation-button">
      {children}
    </Link>
  );
}
