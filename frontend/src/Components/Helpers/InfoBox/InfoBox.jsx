import React from "react";
import "./InfoBox.css";

export default function InfoBox({ title, items }) {
  return (
    <div className="info-box">
      {title && <h2>{title}</h2>}
      <ul>
        {items.map((item, idx) => (
          <li key={idx} className="info-box__item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
