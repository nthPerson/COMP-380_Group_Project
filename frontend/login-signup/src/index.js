import React from 'react';
// The new Root API comes from react-dom/client:
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Grab the <div id="root"> from public/index.html
const container = document.getElementById('root');
// Create a React root (new in React 18+)
const root = createRoot(container);
// Tell it to render your App component
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
