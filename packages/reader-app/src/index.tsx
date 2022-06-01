import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'tailwindcss/tailwind.css';

import { App } from './App';

const root = createRoot(document.getElementById('app')!);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
