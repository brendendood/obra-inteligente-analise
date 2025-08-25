// 💬 Commitlint Configuration - Git Commit Message Quality
// Configuração para verificação de mensagens de commit sem alterações

module.exports = {
  // ===================================================================
  // 📝 CONFIGURAÇÃO BASE
  // ===================================================================
  
  // Usar configuração convencional padrão
  extends: ['@commitlint/config-conventional'],
  
  // Parser para mensagens de commit
  parserPreset: 'conventional-changelog-conventionalcommits',
  
  // ===================================================================
  // 🎯 REGRAS CUSTOMIZADAS
  // ===================================================================
  
  rules: {
    // ===============================
    // 📏 REGRAS DE FORMATO
    // ===============================
    
    // Corpo da mensagem
    'body-case': [0], // Desabilitado - permite qualquer case
    'body-empty': [0], // Desabilitado - corpo opcional
    'body-leading-blank': [2, 'always'], // Linha em branco antes do corpo
    'body-max-length': [2, 'always', 500], // Máximo 500 caracteres no corpo
    'body-max-line-length': [2, 'always', 100], // Máximo 100 caracteres por linha
    'body-min-length': [0], // Desabilitado - sem mínimo
    
    // Footer da mensagem
    'footer-empty': [0], // Footer opcional
    'footer-leading-blank': [2, 'always'], // Linha em branco antes do footer
    'footer-max-length': [2, 'always', 100], // Máximo 100 caracteres no footer
    'footer-max-line-length': [2, 'always', 100], // Máximo 100 caracteres por linha
    'footer-min-length': [0], // Sem mínimo
    
    // Header (primeira linha)
    'header-case': [0], // Permite qualquer case no header
    'header-full-stop': [2, 'never', '.'], // Não terminar com ponto
    'header-max-length': [2, 'always', 100], // Máximo 100 caracteres
    'header-min-length': [2, 'always', 10], // Mínimo 10 caracteres
    
    // ===============================
    // 🏷️ REGRAS DE TIPO
    // ===============================
    
    // Tipo do commit (obrigatório)
    'type-case': [2, 'always', 'lower-case'], // Sempre minúsculo
    'type-empty': [2, 'never'], // Não pode estar vazio
    'type-enum': [
      2,
      'always',
      [
        // Tipos padrão
        'feat', // Nova funcionalidade
        'fix', // Correção de bug
        'docs', // Documentação
        'style', // Formatação, espaços em branco, etc.
        'refactor', // Refatoração de código
        'perf', // Melhoria de performance
        'test', // Adição ou correção de testes
        'chore', // Tarefas de manutenção
        'ci', // Mudanças em CI/CD
        'build', // Mudanças no sistema de build
        'revert', // Reverter commit anterior
        
        // Tipos específicos do projeto
        'quality', // Melhorias de qualidade de código
        'security', // Correções de segurança
        'a11y', // Melhorias de acessibilidade
        'i18n', // Internacionalização
        'config', // Mudanças de configuração
        'deps', // Atualização de dependências
        'release', // Release/versioning
      ],
    ],
    
    // ===============================
    // 🎯 REGRAS DE ESCOPO
    // ===============================
    
    // Escopo do commit (opcional)
    'scope-case': [2, 'always', 'lower-case'], // Sempre minúsculo
    'scope-empty': [0], // Escopo é opcional
    'scope-enum': [
      1, // Warning apenas
      'always',
      [
        // Escopos por área
        'auth', // Autenticação
        'dashboard', // Dashboard
        'projects', // Gestão de projetos
        'upload', // Upload de arquivos
        'ai', // Sistema de IA
        'crm', // CRM
        'admin', // Painel administrativo
        'budget', // Orçamento
        'schedule', // Cronograma
        'docs', // Documentos
        
        // Escopos técnicos
        'ui', // Componentes UI
        'api', // Integrações de API
        'db', // Database/Supabase
        'config', // Configurações
        'build', // Build system
        'deps', // Dependências
        'types', // TypeScript types
        'tests', // Testes
        'quality', // Qualidade de código
        
        // Escopos de arquitetura
        'core', // Funcionalidades core
        'utils', // Utilitários
        'hooks', // Custom hooks
        'stores', // Estado global
        'contexts', // React contexts
        'components', // Componentes
        'pages', // Páginas
        'layouts', // Layouts
        'assets', // Assets estáticos
      ],
    ],
    
    // ===============================
    // 📝 REGRAS DE DESCRIÇÃO
    // ===============================
    
    // Descrição do commit (obrigatória)
    'subject-case': [0], // Permite qualquer case
    'subject-empty': [2, 'never'], // Não pode estar vazio
    'subject-full-stop': [2, 'never', '.'], // Não terminar com ponto
    'subject-max-length': [2, 'always', 100], // Máximo 100 caracteres
    'subject-min-length': [2, 'always', 5], // Mínimo 5 caracteres
    
    // ===============================
    // 🔗 REGRAS DE REFERÊNCIAS
    // ===============================
    
    // Referências (issues, PRs, etc.)
    'references-empty': [0], // Referências opcionais
    
    // Breaking changes
    'body-max-line-length': [0], // Desabilitado para permitir URLs longas
    'footer-max-line-length': [0], // Desabilitado para permitir URLs longas
  },
  
  // ===================================================================
  // 🔧 CONFIGURAÇÕES AVANÇADAS
  // ===================================================================
  
  // Configurações do parser
  parserOpts: {
    // Header pattern personalizado
    headerPattern: /^(\w*)(?:\(([^)]*)\))?: (.*)$/,
    headerCorrespondence: ['type', 'scope', 'subject'],
    
    // Referências (issues, PRs)
    referenceActions: [
      'close',
      'closes',
      'closed',
      'fix',
      'fixes',
      'fixed',
      'resolve',
      'resolves',
      'resolved',
      'refs',
      'references',
    ],
    
    // Issues keywords
    issuePrefixes: ['#', 'gh-'],
    
    // Breaking change keywords
    noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
    
    // Field pattern
    fieldPattern: /^-(.*?)-$/,
    
    // Revert pattern
    revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
    revertCorrespondence: ['header', 'hash'],
  },
  
  // ===================================================================
  // 🎯 CONFIGURAÇÕES ESPECÍFICAS DO PROJETO
  // ===================================================================
  
  // Configurações customizadas para MadenAI
  _qualityConfig: {
    // Tipos mais usados no projeto
    preferredTypes: [
      'feat', // Novas funcionalidades
      'fix', // Correções
      'docs', // Documentação
      'refactor', // Refatoração
      'quality', // Melhorias de qualidade
    ],
    
    // Escopos críticos
    criticalScopes: [
      'auth', // Sistema de autenticação
      'projects', // Core business logic
      'ai', // Sistema de IA
      'db', // Database changes
      'security', // Segurança
    ],
    
    // Padrões recomendados
    patterns: {
      // Feature
      feature: 'feat(scope): add new functionality description',
      
      // Bug fix
      bugfix: 'fix(scope): resolve issue with specific problem',
      
      // Documentation
      documentation: 'docs(scope): update documentation for feature',
      
      // Refactor
      refactor: 'refactor(scope): improve code structure without changing behavior',
      
      // Quality improvement
      quality: 'quality(scope): improve code quality and maintainability',
      
      // Configuration
      config: 'config(scope): update configuration for environment',
      
      // Dependencies
      dependencies: 'deps: update package-name to version x.y.z',
      
      // Breaking change
      breaking: 'feat(scope)!: add breaking change\n\nBREAKING CHANGE: description',
    },
    
    // Métricas para tracking
    metrics: [
      'total-commits',
      'commits-by-type',
      'commits-by-scope',
      'average-message-length',
      'breaking-changes-count',
      'invalid-commits-count',
    ],
    
    // Quality gates
    gates: {
      maxInvalidCommits: 0, // Todos os commits devem ser válidos
      minAverageMessageLength: 20, // Mensagens devem ser descritivas
      maxMessageLength: 100, // Evitar mensagens muito longas
    },
  },
  
  // ===================================================================
  // 🔍 VALIDAÇÃO CUSTOMIZADA
  // ===================================================================
  
  // Plugins customizados (se necessário)
  plugins: [
    // Plugin para validar referências de issues
    {
      rules: {
        'issue-reference': (parsed) => {
          // Validação customizada para referências de issues
          if (parsed.type === 'fix' && !parsed.body?.includes('#')) {
            return [false, 'Fix commits should reference an issue'];
          }
          return [true];
        },
      },
    },
  ],
  
  // Função de validação customizada
  formatter: '@commitlint/format',
  
  // Configurações de prompt (se usar com commitizen)
  prompt: {
    settings: {},
    messages: {
      type: 'Selecione o tipo de mudança que você está commitando:',
      scope: 'Qual é o escopo desta mudança (opcional):',
      subject: 'Escreva uma descrição CURTA e IMPERATIVA da mudança:\n',
      body: 'Forneça uma descrição MAIS LONGA da mudança (opcional). Use "|" para quebrar nova linha:\n',
      breaking: 'Liste qualquer BREAKING CHANGE (opcional):\n',
      footer: 'Liste qualquer ISSUE FECHADA por esta mudança (opcional). Ex.: #31, #34:\n',
      confirmCommit: 'Você tem certeza de que deseja prosseguir com o commit acima?',
    },
  },
};

// ===================================================================
// 📋 INSTRUÇÕES DE USO
// ===================================================================
/*

🔍 VERIFICAR ÚLTIMO COMMIT:
npm run quality:commit

💬 VERIFICAR COMMIT ESPECÍFICO:
npx commitlint --from HEAD~1 --to HEAD

📝 VERIFICAR MENSAGEM:
echo "feat: add new feature" | npx commitlint

🎯 EXEMPLOS DE COMMITS VÁLIDOS:

✅ FUNCIONALIDADES:
feat: add user authentication system
feat(auth): implement two-factor authentication
feat(dashboard): add project overview widgets

✅ CORREÇÕES:
fix: resolve login redirect issue
fix(api): handle null response from supabase
fix(ui): correct button alignment on mobile

✅ DOCUMENTAÇÃO:
docs: update setup instructions
docs(api): add authentication examples
docs(quality): create quality check guide

✅ REFATORAÇÃO:
refactor: simplify user validation logic
refactor(auth): extract common validation functions
refactor(stores): consolidate project state management

✅ QUALIDADE:
quality: add ESLint rules for TypeScript
quality(deps): update and audit dependencies
quality(tests): add smoke tests for core features

❌ EXEMPLOS INVÁLIDOS:
- "Update code" (muito vago)
- "fix bug" (não específico)
- "Add feature." (termina com ponto)
- "FEAT: add feature" (tipo em maiúscula)
- "" (vazio)

🎯 TIPOS PRINCIPAIS:
- feat: Nova funcionalidade
- fix: Correção de bug
- docs: Documentação
- refactor: Refatoração
- quality: Melhoria de qualidade
- chore: Tarefas de manutenção

📋 ESCOPOS COMUNS:
- auth, dashboard, projects, ai, crm
- ui, api, db, config, deps
- tests, quality, security

*/