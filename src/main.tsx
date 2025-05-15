
import React from "react";
import ReactDOM from "react-dom/client";
//import { HashRouter  as Router } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { HelmetProvider } from "react-helmet-async";



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Router>
  </React.StrictMode>,
)
