import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element to mount the Admin Console.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
