import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
      clientPort: 8080
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  build: {
    target: 'esnext',
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'development',
    chunkSizeWarningLimit: 800,
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    // FORÇA uma única instância do React
      include: [
        'react-router-dom',
        '@supabase/supabase-js',
        '@tanstack/react-query',
        'zustand'
      ],
    exclude: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    force: true,
    // CRÍTICO: Evita múltiplas instâncias
    entries: ['src/main.tsx']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // CRITICAL: Force single React instance
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime")
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime']
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  }
}));