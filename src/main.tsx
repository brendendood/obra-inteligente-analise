import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";

const root = createRoot(document.getElementById("root")!);

// REMOVENDO StrictMode que causa double rendering e corrompe React dispatcher
root.render(<App />);
