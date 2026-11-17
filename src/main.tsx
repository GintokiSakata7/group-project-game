import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { preloadAllGameAssets } from './game/preload';
import './index.css';
import './gameplay.css';

// Preload character portraits and critical assets immediately on boot
preloadAllGameAssets();

// Safety hook to allow quick recovery from browser console
if (typeof window !== 'undefined') {
  (window as any).__resetGame = () => {
    try {
      localStorage.removeItem('the-group-project-save');
      localStorage.removeItem('the-group-project-store');
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
