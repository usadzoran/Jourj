import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Ensure complete removal of any legacy service workers and stale PWA caches safely
if (typeof window !== 'undefined') {
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      }).catch(() => {});
    }
  } catch {
    // Ignored in sandboxed/restricted iframe environments
  }

  try {
    if ('caches' in window && window.caches) {
      window.caches.keys().then((keys) => {
        for (const key of keys) {
          window.caches.delete(key).catch(() => {});
        }
      }).catch(() => {});
    }
  } catch {
    // Ignored in sandboxed/restricted iframe environments
  }
}

const rootElement = document.getElementById('root') || (() => {
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
  return el;
})();

rootElement.setAttribute('data-mounted', 'true');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

