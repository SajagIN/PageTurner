// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // Remove <React.StrictMode> temporarily for debugging stability
  // The Router and ThemeProvider are now managed inside App.jsx
  <App />
);
