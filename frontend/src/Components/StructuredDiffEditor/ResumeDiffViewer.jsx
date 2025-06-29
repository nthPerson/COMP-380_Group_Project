import React from 'react';
import './ResumeDiffViewer.css';

export function ResumeDiffViewer({ astWithDiff }) {
  return (
    <div className="resume-diff">
      {astWithDiff.map((node, idx) => {
        const { type, diff, items, level, text } = node;
        const renderText = (chunks) => (
          chunks.map((c, i) => (
            <span key={i} className={c.added ? 'diff-added' : ''}>{c.text}</span>
          ))
        );

        if (type === 'heading') return <h3 key={idx}>{renderText(diff)}</h3>;
        if (type === 'header')  return <h2 key={idx}>{renderText(diff)}</h2>;
        if (type === 'paragraph') return <p key={idx}>{renderText(diff)}</p>;
        if (type === 'list')
          return (
            <ul key={idx}>
              {items.map((it, i) => (
                <li key={i} className={/* maybe highlight new items */ ''}>{it}</li>
              ))}
            </ul>
          );
        return null;
      })}
    </div>
  );
}