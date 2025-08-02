import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";

// Força limpeza completa do cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
  
  // Limpa todos os caches
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => caches.delete(cacheName));
  });
}

// Força reload sem cache
if (!window.location.search.includes('nocache')) {
  window.location.replace(window.location.href + (window.location.search ? '&' : '?') + 'nocache=1');
}

const root = createRoot(document.getElementById("root")!);

// Enable StrictMode in development for better HMR and debugging
if (import.meta.env.DEV) {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  root.render(<App />);
}
