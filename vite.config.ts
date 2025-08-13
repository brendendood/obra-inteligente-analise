
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Força todas as importações de React/ReactDOM para a mesma instância
const reactAlias = path.resolve(__dirname, "node_modules/react");
const reactDomAlias = path.resolve(__dirname, "node_modules/react-dom");

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
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-router-dom'],
        },
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'zustand'
    ],
    exclude: [],
    force: true,
    entries: ['src/main.tsx']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Garante singleton de React/ReactDOM
      "react": reactAlias,
      "react-dom": reactDomAlias,
      "react/jsx-runtime": path.join(reactAlias, "jsx-runtime"),
      "react/jsx-dev-runtime": path.join(reactAlias, "jsx-dev-runtime"),
      // Garante singleton de React Router
      "react-router-dom": path.resolve(__dirname, "node_modules/react-router-dom"),
      "react-router": path.resolve(__dirname, "node_modules/react-router"),
    },
    dedupe: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router',
      'react-router-dom'
    ]
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  }
}));
