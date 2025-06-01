import React from 'react';
// The new Root API comes from react-dom/client:
import { createRoot } from 'react-dom/client';
import App from './App';

// 1. Grab the <div id="root"> from public/index.html
const container = document.getElementById('root');
// 2. Create a React root (new in React 18+)
const root = createRoot(container);
// 3. Tell it to render your App component
root.render(<App />);
