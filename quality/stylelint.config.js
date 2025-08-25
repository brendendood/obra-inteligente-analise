// 🎨 Stylelint Configuration - CSS/Tailwind Quality Check
// Configuração para verificação de estilos sem modificações automáticas

module.exports = {
  // ===================================================================
  // 📝 CONFIGURAÇÃO BASE
  // ===================================================================
  
  // Configurações padrão recomendadas
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    // Descomente se usar Tailwind plugin
    // 'stylelint-config-tailwindcss',
  ],
  
  // Plugins para funcionalidades específicas
  plugins: [
    'stylelint-order', // Ordenação de propriedades
    'stylelint-scss', // Suporte a SCSS (se usado)
    // 'stylelint-tailwindcss', // Tailwind específico
  ],
  
  // ===================================================================
  // 📁 ARQUIVOS E PADRÕES
  // ===================================================================
  
  // Arquivos para verificar
  files: [
    '**/*.css',
    '**/*.scss',
    '**/*.sass',
    '**/*.less',
    // CSS-in-JS (se usado)
    '**/*.tsx',
    '**/*.jsx',
  ],
  
  // Arquivos para ignorar
  ignoreFiles: [
    // Build outputs
    'dist/**/*.css',
    'build/**/*.css',
    '.vite/**/*.css',
    
    // Dependencies
    'node_modules/**',
    
    // Generated CSS
    'src/index.css', // Tailwind base (pode ter muitas violações esperadas)
    
    // Quality reports
    'quality/reports/**',
  ],
  
  // ===================================================================
  // 🎯 REGRAS CUSTOMIZADAS
  // ===================================================================
  
  rules: {
    // ===============================
    // 🚨 REGRAS CRÍTICAS (Errors)
    // ===============================
    
    // Sintaxe e parsing
    'no-invalid-double-slash-comments': true,
    'no-invalid-position-at-import-rule': true,
    'string-no-newline': true,
    
    // Propriedades duplicadas
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],
    
    // Seletores
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'], // CSS Modules
      },
    ],
    
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['custom-elements'],
      },
    ],
    
    // ===============================
    // ⚠️ REGRAS DE QUALIDADE (Warnings)
    // ===============================
    
    // Convenções de nomenclatura
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9-]*$',
      {
        message: 'Use kebab-case for class names',
        severity: 'warning',
      },
    ],
    
    // Valores
    'color-no-invalid-hex': true,
    'length-zero-no-unit': [
      true,
      {
        severity: 'warning',
      },
    ],
    
    // Propriedades
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          // CSS custom properties
          /^--/,
          // Tailwind utilities (se detectadas como unknown)
          'composes', // CSS Modules
        ],
        severity: 'warning',
      },
    ],
    
    // ===============================
    // 📏 REGRAS DE FORMATAÇÃO
    // ===============================
    
    // Indentação
    indentation: [
      2,
      {
        severity: 'warning',
      },
    ],
    
    // Espaçamento
    'block-opening-brace-space-before': 'always',
    'block-closing-brace-newline-after': 'always',
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    
    // Quebras de linha
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
        severity: 'warning',
      },
    ],
    
    // ===============================
    // 🎨 REGRAS ESPECÍFICAS TAILWIND
    // ===============================
    
    // Permitir classes Tailwind
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
        ],
      },
    ],
    
    // Permitir propriedades customizadas do Tailwind
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
          'theme',
          'screen',
          'config',
        ],
      },
    ],
    
    // ===============================
    // 📦 REGRAS DE ORDENAÇÃO
    // ===============================
    
    'order/properties-order': [
      // Layout
      'display',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      
      // Flexbox/Grid
      'flex',
      'flex-direction',
      'flex-wrap',
      'justify-content',
      'align-items',
      'align-content',
      'grid',
      'grid-template',
      'grid-template-columns',
      'grid-template-rows',
      'grid-gap',
      
      // Box model
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      
      // Border
      'border',
      'border-radius',
      'border-width',
      'border-style',
      'border-color',
      
      // Background
      'background',
      'background-color',
      'background-image',
      'background-position',
      'background-size',
      'background-repeat',
      
      // Typography
      'color',
      'font',
      'font-family',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'text-decoration',
      'text-transform',
      
      // Effects
      'opacity',
      'visibility',
      'overflow',
      'transform',
      'transition',
      'animation',
      'box-shadow',
    ],
    
    // ===============================
    // 🔧 REGRAS DESABILITADAS
    // ===============================
    
    // Desabilitar regras que conflitam com Tailwind
    'no-descending-specificity': null, // Tailwind pode ter especificidade reversa
    'selector-class-pattern': null, // Tailwind usa convenções próprias
    
    // Desabilitar para CSS-in-JS (se usado)
    'value-keyword-case': null, // JS pode usar camelCase
  },
  
  // ===================================================================
  // 🎯 OVERRIDES POR TIPO DE ARQUIVO
  // ===================================================================
  
  overrides: [
    // ===============================
    // 🎨 CSS Puro
    // ===============================
    {
      files: ['**/*.css'],
      rules: {
        // Regras específicas para CSS
        'at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer'],
          },
        ],
      },
    },
    
    // ===============================
    // 🔧 SCSS/Sass
    // ===============================
    {
      files: ['**/*.scss', '**/*.sass'],
      customSyntax: 'postcss-scss',
      rules: {
        // Regras específicas para SCSS
        'scss/at-rule-no-unknown': true,
        'scss/selector-no-redundant-nesting-selector': true,
      },
    },
    
    // ===============================
    // ⚛️ CSS-in-JS (styled-components, etc.)
    // ===============================
    {
      files: ['**/*.tsx', '**/*.jsx'],
      customSyntax: 'postcss-styled-syntax',
      rules: {
        // Regras mais flexíveis para CSS-in-JS
        'value-keyword-case': null,
        'property-no-vendor-prefix': null,
      },
    },
    
    // ===============================
    // 📱 CSS Modules
    // ===============================
    {
      files: ['**/*.module.css', '**/*.module.scss'],
      rules: {
        // Permitir :global e :local
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['global', 'local'],
          },
        ],
      },
    },
  ],
  
  // ===================================================================
  // 📊 CONFIGURAÇÕES DE RELATÓRIO
  // ===================================================================
  
  // Configurações para relatórios de qualidade
  _qualityConfig: {
    // Severidades para contagem
    errorSeverities: ['error'],
    warningSeverities: ['warning'],
    
    // Limites para quality gates
    maxErrors: 0,
    maxWarnings: 5,
    
    // Arquivos críticos
    criticalFiles: [
      'src/index.css',
      'src/App.css',
    ],
    
    // Métricas para rastrear
    metrics: [
      'total-files',
      'files-with-errors',
      'files-with-warnings',
      'error-count',
      'warning-count',
      'most-common-violations',
    ],
  },
};

// ===================================================================
// 📋 INSTRUÇÕES DE USO
// ===================================================================
/*

🔍 VERIFICAÇÃO:
npm run quality:styles

📊 RELATÓRIO DETALHADO:
npm run quality:styles:report

🎯 VERIFICAR ARQUIVO ESPECÍFICO:
npx stylelint src/index.css

📁 VERIFICAR DIRETÓRIO:
npx stylelint "src/**/*.css"

🚨 IGNORAR REGRA:
/* stylelint-disable rule-name */

⚙️ CONFIGURAÇÃO:
Editar quality/stylelint.config.js

📈 MÉTRICAS RASTREADAS:
- Total de arquivos CSS
- Arquivos com erros/warnings
- Violações mais comuns
- Propriedades não utilizadas
- Ordem de propriedades

🎨 TAILWIND ESPECÍFICO:
- Classes não reconhecidas
- Uso de @apply
- Ordem de utilitários
- Custom properties

*/