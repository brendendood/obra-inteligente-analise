/**
 * ESLint Import Guards - Regras para encorajar uso de facades/barrels
 * MODO: WARN-ONLY (nunca bloqueia builds)
 * 
 * Como usar:
 * npx eslint -c quality/eslint-import-guards.cjs "src/**/*.{ts,tsx}"
 */

module.exports = {
  extends: [
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    // ===== IMPORT GUARDS - FACADES/BARRELS =====
    
    // Desencorajar deep imports quando barrel está disponível
    'import/no-restricted-paths': [
      'warn',
      {
        zones: [
          // Desencorajar deep imports em utils quando barrel existe
          {
            target: './src/**/*',
            from: './src/lib/utils.ts',
            message: '💡 Considere usar: import { cn } from "@/lib" (barrel disponível)',
          },
          {
            target: './src/**/*',
            from: './src/hooks/use-toast.ts',
            message: '💡 Considere usar: import { useToast } from "@/hooks" (barrel disponível)',
          },
          {
            target: './src/**/*',
            from: './src/hooks/useProjectNavigation.tsx',
            message: '💡 Considere usar: import { useProjectNavigation } from "@/hooks" (barrel disponível)',
          },
          // Desencorajar deep imports em components/ui quando barrel existe
          {
            target: './src/**/*',
            from: './src/components/ui/button.tsx',
            message: '💡 Considere usar: import { Button } from "@/components/ui" (barrel disponível)',
          },
          {
            target: './src/**/*',
            from: './src/components/ui/card.tsx',
            message: '💡 Considere usar: import { Card } from "@/components/ui" (barrel disponível)',
          },
          {
            target: './src/**/*',
            from: './src/components/ui/input.tsx',
            message: '💡 Considere usar: import { Input } from "@/components/ui" (barrel disponível)',
          },
          {
            target: './src/**/*',
            from: './src/components/ui/dialog.tsx',
            message: '💡 Considere usar: import { Dialog } from "@/components/ui" (barrel disponível)',
          },
          // Desencorajar deep imports em agents quando facade existe
          {
            target: './src/**/*',
            from: './src/utils/agents/unifiedAgentService.ts',
            message: '💡 Considere usar: import { sendMessageToAgent } from "@/facades/agents" (facade disponível)',
          },
          {
            target: './src/**/*',
            from: './src/integrations/supabase/client.ts',
            message: '💡 Considere usar: import { supabase } from "@/facades/integrations" (facade disponível)',
          },
        ],
      },
    ],

    // Desencorajar imports muito específicos
    'no-restricted-imports': [
      'warn',
      {
        patterns: [
          {
            group: ['@/components/ui/*'],
            message: '💡 Para componentes frequentes, considere usar: import { Component } from "@/components/ui" (barrel disponível)',
          },
          {
            group: ['@/utils/agents/*'],
            message: '💡 Considere usar: import { ... } from "@/facades/agents" (facade disponível)',
          },
          {
            group: ['@/integrations/supabase/*'],
            message: '💡 Considere usar: import { ... } from "@/facades/integrations" (facade disponível)',
          },
        ],
      },
    ],

    // ===== BOAS PRÁTICAS DE IMPORT =====
    
    // Ordenação de imports (warn apenas)
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@/facades/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    // Evitar imports duplicados
    'import/no-duplicates': 'warn',

    // Evitar imports desnecessários
    'import/no-useless-path-segments': [
      'warn',
      {
        noUselessIndex: false, // Permitir index.ts (são nossos barrels)
      },
    ],

    // ===== REGRAS SUAVES PARA MELHORIA GRADUAL =====
    
    // Todas as outras regras em warn para não quebrar builds
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'warn',
    'no-console': 'off', // Mantemos console.log para debug
  },
  
  // Configurações globais
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  
  // Ignorar arquivos que não devem ser checados
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    '*.config.js',
    '*.config.ts',
    'src/integrations/supabase/types.ts', // Arquivo auto-gerado
  ],
  
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};