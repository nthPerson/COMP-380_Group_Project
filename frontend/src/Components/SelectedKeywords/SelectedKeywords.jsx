import React, { useState, useEffect } from 'react';

export default function SelectedKeywords() {
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState(null);

  // Create the EventSource that receives the stream of currently selected keywords
  useEffect(() => {
    const url = 'http://localhost:5001/api/selected_keywords/stream';
    const es = new EventSource(url, { withCredentials: true });

    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        setKeywords(payload.keywords || []);
      } catch (err) {
        console.error('Failed to parse SSE data:', err);
      }
    };

    es.onerror = (err) => {
      console.error('SSE error:', err);
      setError('Connection lost. Please refresh the page.');
      es.close();
    };

    return () => {
      es.close();
    };
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Selected Keywords</h2>
      {keywords.length === 0 ? (
        <p><em>No keywords selected yet.</em></p>
      ) : (
        <ul>
          {keywords.map((kw, i) => (
            <li key={i}>{kw}</li>
          ))}
        </ul>
      )}
    </div>
  );
}