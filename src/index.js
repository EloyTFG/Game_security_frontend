// index.js or index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';
import './index.css';

// Get the root element from your HTML
const container = document.getElementById('root');

// Create a root using the new API
const root = createRoot(container);

// Render the app using the new createRoot method
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
