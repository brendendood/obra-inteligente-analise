
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
      overlay: false, // Disable overlay to prevent context corruption
      clientPort: 8080
    },
    // Enhanced file system settings for React stability
    fs: {
      strict: false,
      allow: ['..']
    },
    // Cache busting for providers
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // CRITICAL: Force absolute single React instances
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime")
    },
    // Enhanced deduplication
    dedupe: ['react', 'react-dom', 'react/jsx-runtime']
  },
  build: {
    // Performance optimizations
    target: 'esnext',
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'development',
    
    // Optimized chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunks
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI Library chunks
          'ui-radix': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-toast',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select'
          ],
          
          // Backend & Data
          'supabase': ['@supabase/supabase-js'],
          'data': ['@tanstack/react-query', 'zustand'],
          
          // Charts & Visualization
          'charts': ['recharts'],
          
          // Forms & Validation
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Utilities
          'utils': ['date-fns', 'clsx', 'tailwind-merge', 'lucide-react'],
          
          // File handling
          'files': ['react-dropzone', 'file-saver', 'html2canvas', 'jspdf'],
        },
      },
    },
    
    // Optimized chunk sizes
    chunkSizeWarningLimit: 800,
    
    // Asset optimization
    assetsInlineLimit: 2048,
    
    // CSS code splitting
    cssCodeSplit: true,
  },
  
  // Enhanced optimization - CRITICAL FIX for React issues
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'zustand',
      'lucide-react',
      'date-fns',
      'clsx',
      'tailwind-merge'
    ],
    exclude: ['@vite/client', '@vite/env'],
    // CRITICAL: Force single React instance
    force: true
  },
  
  
  // Performance settings
  esbuild: {
    // Remove console.log in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  
  // Cache optimization
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  
  // Development optimizations
  ...(mode === 'development' && {
    define: {
      // Reduce React DevTools overhead
      __REACT_DEVTOOLS_GLOBAL_HOOK__: JSON.stringify({ isDisabled: true }),
    }
  })
}));
