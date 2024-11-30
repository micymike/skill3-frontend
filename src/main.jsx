// src/main.jsx or src/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Ensure this import is present
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
