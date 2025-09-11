import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppShell from './AppShell';
import './index.css';

hydrateRoot(
  document.getElementById('root')!,
  <HelmetProvider>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </HelmetProvider>
);