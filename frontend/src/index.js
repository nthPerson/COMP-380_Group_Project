// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';   // (any global CSS you want)
import ScrollToTop from './Components/Helpers/ScrollToTop/ScrollToTop';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ScrollToTop />
      <App /> 
    </BrowserRouter>
  </React.StrictMode>
);
