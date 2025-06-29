import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
// import { ThemeProvider } from './ThemeContext.jsx';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <Router>
//     <ThemeProvider>
//       <App />
//     </ThemeProvider>
//   </Router>
// );


// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
