// 📊 Bundle Analyzer Configuration - Bundle Size Analysis
// Configuração para análise de tamanho e otimização do bundle

module.exports = {
  // ===================================================================
  // 🎯 CONFIGURAÇÃO PRINCIPAL
  // ===================================================================
  
  // Diretório de build para analisar
  buildDir: './dist',
  
  // Arquivo de output do relatório
  reportFilename: 'quality/reports/bundle-report.html',
  
  // Formato do relatório
  analyzerMode: 'static', // 'static' | 'server' | 'json'
  
  // ===================================================================
  // 📊 CONFIGURAÇÕES DE ANÁLISE
  // ===================================================================
  
  // Configurações específicas para Vite
  viteConfig: {
    // Analisar todos os chunks
    analyzeChunks: true,
    
    // Incluir assets
    includeAssets: true,
    
    // Mostrar gzip sizes
    showGzipSize: true,
    
    // Mostrar brotli sizes
    showBrotliSize: true,
    
    // Threshold para warnings
    warningThreshold: {
      // Tamanho total inicial (KB)
      initialBundle: 300,
      
      // Tamanho após gzip (KB) 
      gzipped: 100,
      
      // Tamanho individual de chunk (KB)
      chunkSize: 50,
      
      // Número de chunks
      chunkCount: 20,
    },
  },
  
  // ===================================================================
  // 🎯 ANÁLISES ESPECÍFICAS
  // ===================================================================
  
  analysis: {
    // ===============================
    // 📦 ANÁLISE DE CHUNKS
    // ===============================
    chunks: {
      // Analisar vendor chunks
      vendor: {
        name: 'vendor',
        pattern: /node_modules/,
        maxSize: 200, // KB
        description: 'Bibliotecas externas (React, Supabase, etc.)',
      },
      
      // Analisar app chunks
      app: {
        name: 'app',
        pattern: /^src\//,
        maxSize: 100, // KB
        description: 'Código da aplicação principal',
      },
      
      // Analisar UI chunks
      ui: {
        name: 'ui',
        pattern: /src\/components\/ui/,
        maxSize: 30, // KB
        description: 'Componentes UI (shadcn/ui)',
      },
      
      // Analisar páginas
      pages: {
        name: 'pages',
        pattern: /src\/pages/,
        maxSize: 50, // KB
        description: 'Páginas da aplicação',
      },
    },
    
    // ===============================
    // 📚 ANÁLISE DE BIBLIOTECAS
    // ===============================
    libraries: {
      // React ecosystem
      react: {
        packages: ['react', 'react-dom', 'react-router-dom'],
        maxSize: 150, // KB
        critical: true,
      },
      
      // UI libraries
      ui: {
        packages: ['@radix-ui/*', 'lucide-react', 'framer-motion'],
        maxSize: 100, // KB
        critical: false,
      },
      
      // State management
      state: {
        packages: ['zustand', '@tanstack/react-query'],
        maxSize: 50, // KB
        critical: true,
      },
      
      // Backend integration
      backend: {
        packages: ['@supabase/supabase-js'],
        maxSize: 80, // KB
        critical: true,
      },
      
      // Utilities
      utils: {
        packages: ['date-fns', 'uuid', 'zod', 'dompurify'],
        maxSize: 40, // KB
        critical: false,
      },
      
      // Styling
      styling: {
        packages: ['tailwindcss', 'class-variance-authority', 'tailwind-merge'],
        maxSize: 20, // KB
        critical: true,
      },
    },
    
    // ===============================
    // 🎨 ANÁLISE DE ASSETS
    // ===============================
    assets: {
      // Imagens
      images: {
        pattern: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        maxSize: 500, // KB total
        maxIndividualSize: 100, // KB por arquivo
      },
      
      // Fontes
      fonts: {
        pattern: /\.(woff|woff2|ttf|eot)$/i,
        maxSize: 200, // KB total
        maxIndividualSize: 50, // KB por arquivo
      },
      
      // Ícones
      icons: {
        pattern: /\.(ico|svg)$/i,
        maxSize: 50, // KB total
        maxIndividualSize: 10, // KB por arquivo
      },
    },
    
    // ===============================
    // 🔍 ANÁLISE DE DUPLICATAS
    // ===============================
    duplicates: {
      // Threshold para considerar duplicata
      threshold: 1024, // bytes
      
      // Bibliotecas comuns que podem duplicar
      commonDuplicates: [
        'lodash',
        'moment',
        'date-fns',
        'uuid',
        'classnames',
        'react',
      ],
      
      // Ignorar duplicatas esperadas
      ignoredDuplicates: [
        // Diferentes versões podem ser necessárias
        'tslib',
        '@types/*',
      ],
    },
  },
  
  // ===================================================================
  // 📊 MÉTRICAS DE PERFORMANCE
  // ===================================================================
  
  performance: {
    // ===============================
    // 🎯 TARGETS DE PERFORMANCE
    // ===============================
    targets: {
      // Core Web Vitals inspired
      initialLoad: {
        maxSize: 300, // KB (uncompressed)
        maxGzipSize: 100, // KB (gzipped)
        description: 'Carregamento inicial',
      },
      
      // Time to Interactive approximation
      timeToInteractive: {
        maxSize: 500, // KB total
        maxGzipSize: 150, // KB gzipped
        description: 'Tempo até interatividade',
      },
      
      // First Contentful Paint approximation
      firstContentfulPaint: {
        maxSize: 200, // KB critical resources
        maxGzipSize: 70, // KB gzipped
        description: 'Primeira pintura com conteúdo',
      },
    },
    
    // ===============================
    // 📱 TARGETS POR DISPOSITIVO
    // ===============================
    devices: {
      mobile: {
        maxInitialSize: 250, // KB
        maxTotalSize: 400, // KB
        description: 'Dispositivos móveis (3G)',
      },
      
      tablet: {
        maxInitialSize: 300, // KB
        maxTotalSize: 600, // KB
        description: 'Tablets (WiFi)',
      },
      
      desktop: {
        maxInitialSize: 400, // KB
        maxTotalSize: 1000, // KB
        description: 'Desktop (broadband)',
      },
    },
  },
  
  // ===================================================================
  // 🔧 CONFIGURAÇÕES DE OTIMIZAÇÃO
  // ===================================================================
  
  optimization: {
    // ===============================
    // 💡 SUGESTÕES DE OTIMIZAÇÃO
    // ===============================
    suggestions: {
      // Code splitting
      codeSplitting: {
        enabled: true,
        chunkSizeThreshold: 50, // KB
        message: 'Considere dividir chunks grandes em chunks menores',
      },
      
      // Tree shaking
      treeShaking: {
        enabled: true,
        unusedThreshold: 10, // KB
        message: 'Verifique imports não utilizados',
      },
      
      // Dynamic imports
      dynamicImports: {
        enabled: true,
        routeBasedSplitting: true,
        message: 'Use dynamic imports para rotas não críticas',
      },
      
      // Bundle splitting
      bundleSplitting: {
        enabled: true,
        vendorThreshold: 150, // KB
        message: 'Separe bibliotecas vendor em chunk dedicado',
      },
    },
    
    // ===============================
    // ⚡ OTIMIZAÇÕES AUTOMÁTICAS
    // ===============================
    recommendations: [
      {
        condition: 'chunk.size > 100kb',
        suggestion: 'Dividir chunk em partes menores',
        impact: 'high',
      },
      {
        condition: 'duplicate.count > 2',
        suggestion: 'Eliminar bibliotecas duplicadas',
        impact: 'medium',
      },
      {
        condition: 'unused.exports > 50%',
        suggestion: 'Remover exports não utilizados',
        impact: 'medium',
      },
      {
        condition: 'asset.size > 100kb',
        suggestion: 'Otimizar ou lazy load assets grandes',
        impact: 'high',
      },
    ],
  },
  
  // ===================================================================
  // 📋 CONFIGURAÇÕES DE RELATÓRIO
  // ===================================================================
  
  reporting: {
    // Formato de saída
    formats: ['html', 'json', 'text'],
    
    // Incluir no relatório
    include: {
      treemap: true,          // Visualização em treemap
      chunkAnalysis: true,    // Análise de chunks
      assetAnalysis: true,    // Análise de assets
      duplicateAnalysis: true, // Análise de duplicatas
      suggestions: true,      // Sugestões de otimização
      performance: true,      // Métricas de performance
      timeline: false,        // Timeline de builds (histórico)
    },
    
    // Configurações do relatório HTML
    html: {
      template: 'default',
      title: 'MadenAI - Bundle Analysis Report',
      openAnalyzer: false, // Não abrir automaticamente
    },
    
    // Configurações do relatório JSON
    json: {
      filename: 'quality/reports/bundle-analysis.json',
      pretty: true,
    },
    
    // Configurações do relatório texto
    text: {
      filename: 'quality/reports/bundle-summary.txt',
      includeDetails: true,
    },
  },
  
  // ===================================================================
  // 📊 CONFIGURAÇÕES DE QUALIDADE
  // ===================================================================
  
  _qualityConfig: {
    // Quality gates
    gates: {
      maxInitialBundle: 300, // KB
      maxGzippedBundle: 100, // KB
      maxChunkSize: 50, // KB
      maxAssetSize: 100, // KB
      maxDuplicates: 3,
    },
    
    // Métricas críticas
    criticalMetrics: [
      'initial-bundle-size',
      'gzipped-bundle-size',
      'largest-chunk-size',
      'total-chunk-count',
      'duplicate-dependency-count',
    ],
    
    // Trending (para comparação com builds anteriores)
    trending: {
      enabled: false, // Requer histórico
      thresholds: {
        sizeIncrease: 10, // % increase warning
        chunkIncrease: 2, // chunk count increase warning
      },
    },
  },
};

// ===================================================================
// 📋 INSTRUÇÕES DE USO
// ===================================================================
/*

🔍 ANÁLISE COMPLETA:
npm run quality:bundle

📊 RELATÓRIO VISUAL:
npm run quality:bundle:visual

🎯 ANÁLISE RÁPIDA:
npm run quality:bundle:summary

📈 MONITORAR CRESCIMENTO:
npm run quality:bundle:diff

⚡ SUGESTÕES DE OTIMIZAÇÃO:
npm run quality:bundle:optimize

🔧 VERIFICAR CONFIGURAÇÃO:
npx vite build --analyze

📊 MÉTRICAS IMPORTANTES:
- Bundle inicial: < 300KB
- Bundle gzipped: < 100KB
- Maior chunk: < 50KB
- Total de chunks: < 20
- Duplicatas: < 3

🎯 TARGETS DE PERFORMANCE:
- Mobile (3G): < 250KB inicial
- Tablet (WiFi): < 300KB inicial  
- Desktop: < 400KB inicial

📱 OTIMIZAÇÕES SUGERIDAS:
- Code splitting por rota
- Dynamic imports para recursos não críticos
- Tree shaking de bibliotecas
- Compressão de assets
- Lazy loading de componentes

*/