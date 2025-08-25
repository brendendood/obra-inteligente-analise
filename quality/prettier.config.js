// 🎨 Prettier Configuration - Check Only Mode
// Configuração para verificação de formatação sem modificações automáticas

module.exports = {
  // ===================================================================
  // 📝 CONFIGURAÇÃO BÁSICA
  // ===================================================================
  
  // Largura de linha (padrão Lovable/React)
  printWidth: 80,
  
  // Tamanho da indentação
  tabWidth: 2,
  
  // Usar espaços em vez de tabs
  useTabs: false,
  
  // Ponto e vírgula no final das declarações
  semi: true,
  
  // Aspas simples em vez de duplas
  singleQuote: true,
  
  // Aspas em propriedades de objeto apenas quando necessário
  quoteProps: 'as-needed',
  
  // Vírgula no final de arrays/objetos
  trailingComma: 'es5',
  
  // Espaços dentro de chaves de objetos
  bracketSpacing: true,
  
  // Posição da chave de fechamento em JSX
  bracketSameLine: false,
  
  // Parênteses em arrow functions com um parâmetro
  arrowParens: 'avoid',
  
  // ===================================================================
  // 📁 CONFIGURAÇÃO DE ARQUIVOS
  // ===================================================================
  
  // Padrões de arquivos para verificar
  ignore: [
    // Build outputs
    'dist/**',
    'build/**',
    '.vite/**',
    
    // Dependencies
    'node_modules/**',
    
    // Cache directories
    '.cache/**',
    '.next/**',
    '.nuxt/**',
    
    // Config files que não devem ser formatados
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'bun.lockb',
    
    // Generated files
    'src/integrations/supabase/types.ts',
    
    // Quality reports
    'quality/reports/**',
    
    // Documentation builds
    'docs/.vitepress/dist/**',
  ],
  
  // ===================================================================
  // 🎯 OVERRIDES POR TIPO DE ARQUIVO
  // ===================================================================
  
  overrides: [
    // ===============================
    // 📝 TypeScript/JavaScript
    // ===============================
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      options: {
        parser: 'typescript',
        singleQuote: true,
        trailingComma: 'es5',
        semi: true,
      },
    },
    
    // ===============================
    // 🎨 CSS/SCSS/Less
    // ===============================
    {
      files: ['*.css', '*.scss', '*.less'],
      options: {
        parser: 'css',
        singleQuote: false, // CSS usa aspas duplas
      },
    },
    
    // ===============================
    // 📄 Markdown
    // ===============================
    {
      files: ['*.md', '*.mdx'],
      options: {
        parser: 'markdown',
        printWidth: 80,
        proseWrap: 'preserve',
        singleQuote: false,
      },
    },
    
    // ===============================
    // 📋 JSON/YAML
    // ===============================
    {
      files: ['*.json', '*.jsonc'],
      options: {
        parser: 'json',
        trailingComma: 'none',
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        parser: 'yaml',
        singleQuote: true,
      },
    },
    
    // ===============================
    // 🔧 Config Files
    // ===============================
    {
      files: [
        '*.config.js',
        '*.config.ts',
        '*.config.mjs',
        'vite.config.*',
        'tailwind.config.*',
        'eslint.config.*',
      ],
      options: {
        printWidth: 100, // Configs podem ser mais largos
        singleQuote: true,
      },
    },
    
    // ===============================
    // ⚛️ React/JSX Específico
    // ===============================
    {
      files: ['*.tsx', '*.jsx'],
      options: {
        jsxSingleQuote: true,
        bracketSameLine: false,
        htmlWhitespaceSensitivity: 'css',
      },
    },
  ],
  
  // ===================================================================
  // 🎨 CONFIGURAÇÕES ESPECÍFICAS TAILWIND
  // ===================================================================
  
  // Plugin para organizar classes Tailwind
  plugins: [
    // Descomentado apenas se o plugin estiver instalado
    // 'prettier-plugin-tailwindcss',
  ],
  
  // Configuração do plugin Tailwind (se ativo)
  tailwindConfig: './tailwind.config.ts',
  
  // ===================================================================
  // 🔍 CONFIGURAÇÕES DE VERIFICAÇÃO
  // ===================================================================
  
  // Configurações específicas para check-only mode
  // (usado via CLI: prettier --check)
  
  // Ignorar warnings sobre parser
  requirePragma: false,
  insertPragma: false,
  
  // Configuração de fim de linha (auto-detect)
  endOfLine: 'lf',
  
  // ===================================================================
  // 📊 CONFIGURAÇÕES DE RELATÓRIO
  // ===================================================================
  
  // Configurações para relatórios de qualidade
  // (não são opções nativas do Prettier, mas usadas em scripts)
  _qualityConfig: {
    // Formato do relatório
    reportFormat: 'detailed', // 'detailed' | 'summary' | 'json'
    
    // Arquivos críticos que devem sempre estar formatados
    criticalFiles: [
      'src/App.tsx',
      'src/main.tsx',
      'src/lib/utils.ts',
      'src/integrations/supabase/client.ts',
    ],
    
    // Limite de arquivos não formatados para warning
    warningThreshold: 5,
    
    // Limite de arquivos não formatados para error
    errorThreshold: 20,
  },
};

// ===================================================================
// 📋 INSTRUÇÕES DE USO
// ===================================================================
/*

🔍 VERIFICAÇÃO (Check-only):
npm run quality:prettier

📊 RELATÓRIO DETALHADO:
npm run quality:prettier:report

🎯 VERIFICAR ARQUIVO ESPECÍFICO:
npx prettier --check src/App.tsx

📁 VERIFICAR DIRETÓRIO:
npx prettier --check "src/**/*.{ts,tsx}"

🚨 IGNORAR ARQUIVO:
Adicionar ao array 'ignore' acima ou criar .prettierignore

⚙️ INTEGRAÇÃO COM ESLINT:
Usar eslint-config-prettier para evitar conflitos

📈 MÉTRICAS:
- Arquivos verificados
- Arquivos não formatados
- Tempo de verificação
- Problemas por tipo

*/