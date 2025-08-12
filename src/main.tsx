import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";

const root = createRoot(document.getElementById("root")!);

// Hotfix: purge old service workers and caches to avoid stale bundles causing React duplication
if (typeof window !== 'undefined' && (window as any).__madenai_sw_purged__ !== true && 'serviceWorker' in navigator) {
  (window as any).__madenai_sw_purged__ = true;
  (async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) await reg.unregister();
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
      }
      console.info('[MadenAI] SW and caches purged');
    } catch (e) {
      console.warn('[MadenAI] SW purge skipped:', e);
    }
  })();
}

// REMOVENDO StrictMode que causa double rendering e corrompe React dispatcher
console.info('[MadenAI] React version:', (React as any).version);
root.render(<App />);
