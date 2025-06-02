import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import './styles/global.css';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
