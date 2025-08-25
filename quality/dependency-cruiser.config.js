// 📦 Dependency Cruiser Configuration - Architecture Analysis
// Configuração para análise de dependências e arquitetura sem modificações

module.exports = {
  // ===================================================================
  // 🎯 CONFIGURAÇÃO PRINCIPAL
  // ===================================================================
  
  // Diretórios base para análise
  baseDir: '.',
  
  // Padrões de arquivos para incluir
  includeOnly: [
    '^src/',
    '^contracts/',
    '^docs/',
    '^quality/',
    // Configs importantes
    '^[^/]+\\.config\\.(js|ts|mjs)$',
    '^package\\.json$',
    '^tsconfig.*\\.json$',
  ],
  
  // Padrões para excluir
  exclude: [
    // Build outputs
    '^dist/',
    '^build/',
    '^\\.vite/',
    
    // Dependencies
    '^node_modules/',
    
    // Cache
    '^\\.cache/',
    '^tmp/',
    
    // IDE
    '^\\.vscode/',
    '^\\.idea/',
    
    // Generated files
    'src/integrations/supabase/types\\.ts$',
    
    // Test files (se existirem)
    '\\.test\\.(js|ts|jsx|tsx)$',
    '\\.spec\\.(js|ts|jsx|tsx)$',
  ],
  
  // ===================================================================
  // 🚨 REGRAS DE VIOLAÇÃO
  // ===================================================================
  
  forbidden: [
    // ===============================
    // 🔄 DEPENDÊNCIAS CIRCULARES
    // ===============================
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
      comment: 'Dependências circulares devem ser evitadas para manter a arquitetura limpa',
    },
    
    // ===============================
    // 🏗️ VIOLAÇÕES ARQUITETURAIS
    // ===============================
    {
      name: 'no-pages-to-components',
      severity: 'error',
      from: {
        path: '^src/pages/',
      },
      to: {
        path: '^src/components/',
        pathNot: '^src/components/(ui|layout)/',
      },
      comment: 'Páginas não devem importar componentes específicos (apenas ui e layout)',
    },
    
    {
      name: 'no-components-to-pages',
      severity: 'error',
      from: {
        path: '^src/components/',
      },
      to: {
        path: '^src/pages/',
      },
      comment: 'Componentes não devem importar páginas',
    },
    
    {
      name: 'no-ui-to-business-logic',
      severity: 'error',
      from: {
        path: '^src/components/ui/',
      },
      to: {
        path: '^src/(hooks|stores|utils)/',
        pathNot: '^src/lib/utils\\.ts$',
      },
      comment: 'Componentes UI não devem ter dependências de lógica de negócio',
    },
    
    // ===============================
    // 📱 REGRAS DE CAMADAS
    // ===============================
    {
      name: 'no-skip-layers',
      severity: 'warning',
      from: {
        path: '^src/pages/',
      },
      to: {
        path: '^src/integrations/',
      },
      comment: 'Páginas devem usar hooks/stores, não integrations diretamente',
    },
    
    {
      name: 'no-direct-integration-from-components',
      severity: 'warning',
      from: {
        path: '^src/components/',
        pathNot: '^src/components/(providers|auth)/',
      },
      to: {
        path: '^src/integrations/',
      },
      comment: 'Componentes devem usar hooks, não integrations diretamente',
    },
    
    // ===============================
    // 🔐 REGRAS DE SEGURANÇA
    // ===============================
    {
      name: 'no-secret-imports',
      severity: 'error',
      from: {
        path: '^src/components/',
      },
      to: {
        path: '\\.(env|secret|key)$',
      },
      comment: 'Componentes não devem importar arquivos de secrets',
    },
    
    // ===============================
    // 📦 DEPENDÊNCIAS EXTERNAS
    // ===============================
    {
      name: 'no-dev-dependencies-in-production',
      severity: 'error',
      from: {
        path: '^src/',
      },
      to: {
        dependencyTypes: ['dev'],
      },
      comment: 'Código de produção não deve usar dev dependencies',
    },
    
    {
      name: 'no-test-dependencies-in-production',
      severity: 'warning',
      from: {
        path: '^src/',
      },
      to: {
        path: '(test|spec|mock)',
      },
      comment: 'Código de produção não deve importar utilities de teste',
    },
    
    // ===============================
    // 🎯 REGRAS ESPECÍFICAS MADENAI
    // ===============================
    {
      name: 'use-unified-project-store',
      severity: 'warning',
      from: {
        path: '^src/',
      },
      to: {
        path: '^src/stores/projectStore\\.ts$',
      },
      comment: 'Use unifiedProjectStore em vez de projectStore (legacy)',
    },
    
    {
      name: 'no-legacy-pages',
      severity: 'error',
      from: {
        path: '^src/',
      },
      to: {
        path: '^src/pages/(Projects|ProjectsPage|ProjectsList)\\.tsx$',
      },
      comment: 'Use Dashboard.tsx em vez das páginas legacy de Projects',
    },
  ],
  
  // ===================================================================
  // ✅ DEPENDÊNCIAS PERMITIDAS
  // ===================================================================
  
  allowed: [
    // ===============================
    // 📚 UTILITIES CORE
    // ===============================
    {
      from: {},
      to: {
        path: '^src/lib/utils\\.ts$',
      },
      comment: 'lib/utils pode ser usado por qualquer módulo',
    },
    
    // ===============================
    // 🎨 UI COMPONENTS
    // ===============================
    {
      from: {},
      to: {
        path: '^src/components/ui/',
      },
      comment: 'Componentes UI podem ser usados por qualquer módulo',
    },
    
    // ===============================
    // 🔗 INTEGRATIONS VIA HOOKS
    // ===============================
    {
      from: {
        path: '^src/hooks/',
      },
      to: {
        path: '^src/integrations/',
      },
      comment: 'Hooks podem acessar integrations diretamente',
    },
    
    // ===============================
    // 🗃️ STORES
    // ===============================
    {
      from: {
        path: '^src/(hooks|contexts)/',
      },
      to: {
        path: '^src/stores/',
      },
      comment: 'Hooks e contexts podem usar stores',
    },
  ],
  
  // ===================================================================
  // 📊 OPÇÕES DE RELATÓRIO
  // ===================================================================
  
  options: {
    // Incluir dependências não utilizadas
    doNotFollow: {
      dependencyTypes: ['npm-no-pkg', 'npm-unknown'],
    },
    
    // Incluir tipos TypeScript
    tsPreCompilationDeps: true,
    
    // Incluir package.json
    includePackageJsonDeps: true,
    
    // Reportar dependências não utilizadas
    reportUnusedDependencies: true,
    
    // Incluir métricas de módulos
    includeModuleMetrics: true,
    
    // Configuração de output
    outputType: 'json',
    outputFileName: 'quality/reports/dependency-report.json',
    
    // Incluir dependências externas no relatório
    includeExternalDependencies: true,
    
    // Configurações de cache
    cache: {
      folder: 'node_modules/.cache/dependency-cruiser',
      strategy: 'metadata',
    },
  },
  
  // ===================================================================
  // 📈 MÉTRICAS E ANÁLISES
  // ===================================================================
  
  _qualityConfig: {
    // Métricas para rastrear
    metrics: [
      'total-modules',
      'circular-dependencies',
      'architectural-violations',
      'unused-dependencies',
      'outdated-dependencies',
      'dependency-depth',
      'module-coupling',
      'module-cohesion',
    ],
    
    // Limites para quality gates
    limits: {
      maxCircularDependencies: 0,
      maxArchitecturalViolations: 0,
      maxUnusedDependencies: 5,
      maxDependencyDepth: 6,
      maxModuleFanOut: 10,
    },
    
    // Arquitetura esperada
    expectedLayers: [
      'pages → hooks/contexts → stores → integrations',
      'components → hooks → stores',
      'utils → (qualquer)',
      'ui → lib/utils apenas',
    ],
    
    // Módulos críticos para monitorar
    criticalModules: [
      'src/App.tsx',
      'src/main.tsx',
      'src/lib/utils.ts',
      'src/integrations/supabase/client.ts',
      'src/stores/unifiedProjectStore.ts',
      'src/stores/authStore.ts',
    ],
  },
};

// ===================================================================
// 📋 INSTRUÇÕES DE USO
// ===================================================================
/*

🔍 ANÁLISE COMPLETA:
npm run quality:deps

📊 RELATÓRIO VISUAL:
npm run quality:deps:graph

🎯 VERIFICAR MÓDULO ESPECÍFICO:
npx dependency-cruiser src/App.tsx

🔄 ENCONTRAR DEPENDÊNCIAS CIRCULARES:
npx dependency-cruiser --validate quality/dependency-cruiser.config.js src

📦 DEPENDÊNCIAS NÃO UTILIZADAS:
npm run quality:deps:unused

🏗️ VISUALIZAR ARQUITETURA:
npm run quality:deps:architecture

📈 MÉTRICAS IMPORTANTES:
- Dependências circulares: 0 (crítico)
- Violações arquiteturais: 0 (crítico)
- Profundidade máxima: < 6 níveis
- Fan-out por módulo: < 10
- Acoplamento: baixo
- Coesão: alta

🎯 ARQUITETURA ESPERADA:
pages → hooks/contexts → stores → integrations
components → hooks → stores → integrations
ui → lib/utils apenas
utils → qualquer

⚠️ VIOLAÇÕES COMUNS:
- Dependências circulares entre stores/hooks
- Componentes UI importando lógica de negócio
- Páginas importando integration diretamente
- Uso de stores legacy em vez de unified

*/