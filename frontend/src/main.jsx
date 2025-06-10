import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Make sure App.jsx exists
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
