# 🏗️ Plano de Reorganização da Estrutura - MadenAI

**Data:** 2025-08-25  
**Versão:** 1.0  
**Projeto:** MadenAI (React + TypeScript + Supabase)  
**Modo:** ULTRA SEGURO (apenas planejamento)

---

## 📋 Resumo Executivo

Este documento define um plano abrangente para reorganizar a estrutura de pastas do projeto MadenAI, migrando de uma estrutura monolítica para uma arquitetura modular e escalável, mantendo 100% de compatibilidade funcional.

### Objetivos

1. **Modularização:** Separar responsabilidades em módulos independentes
2. **Escalabilidade:** Facilitar crescimento e manutenção da equipe
3. **Testabilidade:** Melhorar cobertura e isolamento de testes
4. **Performance:** Otimizar importações e tree-shaking
5. **Manutenibilidade:** Reduzir acoplamento e aumentar coesão

---

## 🎯 Estrutura-Alvo

### Arquitetura Proposta

```
madenai/
├── apps/                           # Aplicações principais
│   ├── web/                        # Frontend React (atual src/)
│   │   ├── src/
│   │   │   ├── app/                # Configuração da aplicação
│   │   │   ├── pages/              # Componentes de página
│   │   │   ├── features/           # Features modulares
│   │   │   └── shared/             # Recursos compartilhados
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── admin/                      # Futuro painel admin separado
│
├── packages/                       # Pacotes reutilizáveis
│   ├── ui/                         # Design System
│   │   ├── src/
│   │   │   ├── components/         # Componentes UI
│   │   │   ├── styles/             # Estilos globais
│   │   │   └── tokens/             # Design tokens
│   │   └── package.json
│   │
│   ├── core/                       # Lógica de negócio
│   │   ├── src/
│   │   │   ├── types/              # Tipos globais
│   │   │   ├── utils/              # Utilitários
│   │   │   ├── constants/          # Constantes
│   │   │   └── validation/         # Schemas Zod
│   │   └── package.json
│   │
│   ├── auth/                       # Módulo de autenticação
│   │   ├── src/
│   │   │   ├── components/         # Componentes auth
│   │   │   ├── hooks/              # Hooks auth
│   │   │   ├── stores/             # Estado auth
│   │   │   └── services/           # Serviços auth
│   │   └── package.json
│   │
│   ├── projects/                   # Módulo de projetos
│   │   ├── src/
│   │   │   ├── components/         # Componentes projetos
│   │   │   ├── hooks/              # Hooks projetos
│   │   │   ├── stores/             # Estado projetos
│   │   │   └── services/           # Serviços projetos
│   │   └── package.json
│   │
│   ├── ai/                         # Módulo IA
│   │   ├── src/
│   │   │   ├── components/         # Componentes IA
│   │   │   ├── hooks/              # Hooks IA
│   │   │   ├── agents/             # Configurações agentes
│   │   │   └── services/           # Serviços IA
│   │   └── package.json
│   │
│   └── analytics/                  # Módulo analytics
│       ├── src/
│       │   ├── components/         # Componentes analytics
│       │   ├── hooks/              # Hooks analytics
│       │   └── services/           # Serviços analytics
│       └── package.json
│
├── modules/                        # Módulos de infraestrutura
│   ├── database/                   # Configurações DB
│   │   ├── migrations/             # Migrações
│   │   ├── seeds/                  # Seeds
│   │   ├── types/                  # Tipos Supabase
│   │   └── client.ts               # Cliente Supabase
│   │
│   ├── email/                      # Sistema de email
│   │   ├── templates/              # Templates
│   │   ├── services/               # Serviços email
│   │   └── types.ts                # Tipos email
│   │
│   └── monitoring/                 # Observabilidade
│       ├── logger/                 # Logger adapter
│       ├── tracing/                # Request tracing
│       └── metrics/                # Métricas
│
├── infra/                          # Infraestrutura e configuração
│   ├── docker/                     # Configurações Docker
│   ├── ci/                         # Pipelines CI/CD
│   ├── deployment/                 # Scripts deploy
│   └── monitoring/                 # Configurações observabilidade
│
├── tests/                          # Testes organizados
│   ├── smoke/                      # Smoke tests (já existente)
│   ├── integration/                # Testes integração
│   ├── e2e/                        # Testes end-to-end
│   ├── fixtures/                   # Dados teste
│   └── utils/                      # Utilitários teste
│
├── docs/                           # Documentação (já existente)
│   ├── api/                        # Documentação API
│   ├── db/                         # Documentação DB
│   ├── refactor/                   # Documentação refactor
│   └── guides/                     # Guias desenvolvimento
│
├── tools/                          # Ferramentas desenvolvimento
│   ├── scripts/                    # Scripts utilitários
│   ├── generators/                 # Geradores código
│   └── quality/                    # Ferramentas qualidade
│
├── package.json                    # Root workspace
├── pnpm-workspace.yaml             # Configuração workspace
├── tsconfig.json                   # TypeScript root
└── README.md                       # Documentação principal
```

---

## 🔧 Estratégias de Compatibilidade

### 1. Node.js/TypeScript (Stack Atual)

#### A. Barrels (index.ts)
Cada pacote terá um arquivo `index.ts` que exporta todas as funcionalidades públicas:

```typescript
// packages/ui/src/index.ts
export * from './components';
export * from './styles';
export * from './tokens';
export { default as Button } from './components/Button';
export { default as Card } from './components/Card';

// packages/auth/src/index.ts
export * from './hooks';
export * from './components';
export * from './stores';
export { useAuth } from './hooks/useAuth';
export { AuthProvider } from './components/AuthProvider';
```

#### B. Path Aliases (tsconfig)
Configuração de aliases para importações limitas:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@madenai/ui": ["./packages/ui/src"],
      "@madenai/ui/*": ["./packages/ui/src/*"],
      "@madenai/core": ["./packages/core/src"],
      "@madenai/core/*": ["./packages/core/src/*"],
      "@madenai/auth": ["./packages/auth/src"],
      "@madenai/auth/*": ["./packages/auth/src/*"],
      "@madenai/projects": ["./packages/projects/src"],
      "@madenai/projects/*": ["./packages/projects/src/*"],
      "@madenai/ai": ["./packages/ai/src"],
      "@madenai/ai/*": ["./packages/ai/src/*"],
      "@madenai/analytics": ["./packages/analytics/src"],
      "@madenai/analytics/*": ["./packages/analytics/src/*"],
      "@/database": ["./modules/database"],
      "@/database/*": ["./modules/database/*"],
      "@/shared": ["./apps/web/src/shared"],
      "@/shared/*": ["./apps/web/src/shared/*"]
    }
  }
}
```

#### C. Re-exports Estratégicos
Manter compatibilidade durante migração com re-exports:

```typescript
// apps/web/src/shared/compat/index.ts (temporário)
// Mantém imports antigos funcionando durante migração
export { Button, Card, Input } from '@madenai/ui';
export { useAuth, AuthProvider } from '@madenai/auth';
export { useProjects, ProjectCard } from '@madenai/projects';
```

#### D. Workspace Configuration (pnpm/yarn)
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'modules/*'
```

```json
// Root package.json
{
  "name": "@madenai/root",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*", 
    "modules/*"
  ],
  "scripts": {
    "dev": "pnpm --filter @madenai/web dev",
    "build": "pnpm --recursive build",
    "test": "pnpm --recursive test",
    "lint": "pnpm --recursive lint"
  }
}
```

---

## 📊 Matriz Origem → Destino

### Core Application Files

| Origem | Destino | Tipo | Compatibilidade |
|--------|---------|------|-----------------|
| `src/App.tsx` | `apps/web/src/app/App.tsx` | Mover | Path alias |
| `src/App.css` | `apps/web/src/app/App.css` | Mover | Path alias |
| `src/main.tsx` | `apps/web/src/main.tsx` | Mover | Path alias |
| `src/index.css` | `packages/ui/src/styles/globals.css` | Mover + Rename | Import update |

### Pages

| Origem | Destino | Tipo | Compatibilidade |
|--------|---------|------|-----------------|
| `src/pages/LandingPage.tsx` | `apps/web/src/pages/LandingPage.tsx` | Mover | Path alias |
| `src/pages/Login.tsx` | `packages/auth/src/components/LoginPage.tsx` | Mover + Refactor | Re-export |
| `src/pages/Signup.tsx` | `packages/auth/src/components/SignupPage.tsx` | Mover + Refactor | Re-export |
| `src/pages/Dashboard.tsx` | `apps/web/src/pages/Dashboard.tsx` | Mover | Path alias |
| `src/pages/Upload.tsx` | `apps/web/src/pages/Upload.tsx` | Mover | Path alias |
| `src/pages/Assistant.tsx` | `packages/ai/src/components/AssistantPage.tsx` | Mover + Refactor | Re-export |
| `src/pages/Account.tsx` | `packages/auth/src/components/AccountPage.tsx` | Mover + Refactor | Re-export |
| `src/pages/AdminPanel.tsx` | `apps/web/src/pages/AdminPanel.tsx` | Mover | Path alias |
| `src/pages/CRMPage.tsx` | `apps/web/src/pages/CRMPage.tsx` | Mover | Path alias |
| `src/pages/project-specific/*` | `packages/projects/src/pages/*` | Mover + Refactor | Re-export |

### Components

| Origem | Destino | Tipo | Compatibilidade |
|--------|---------|------|-----------------|
| `src/components/ui/*` | `packages/ui/src/components/*` | Mover | Barrel exports |
| `src/components/auth/*` | `packages/auth/src/components/*` | Mover | Barrel exports |
| `src/components/admin/*` | `apps/web/src/features/admin/components/*` | Mover | Path alias |
| `src/components/account/*` | `packages/auth/src/components/*` | Mover | Barrel exports |
| `src/components/error/*` | `packages/core/src/components/error/*` | Mover | Barrel exports |
| `src/components/providers/*` | `packages/core/src/providers/*` | Mover | Barrel exports |
| `src/components/project/*` | `packages/projects/src/components/*` | Mover | Barrel exports |

### Hooks

| Origem | Destino | Tipo | Compatibilidade |
|--------|---------|------|-----------------|
| `src/hooks/use-toast.ts` | `packages/ui/src/hooks/use-toast.ts` | Mover | Barrel exports |
| `src/hooks/useAuth.ts` | `packages/auth/src/hooks/useAuth.ts` | Mover | Barrel exports |
| `src/hooks/useProjects.ts` | `packages/projects/src/hooks/useProjects.ts` | Mover | Barrel exports |
| `src/hooks/useUnifiedProjectStore.ts` | `packages/projects/src/stores/useUnifiedProjectStore.ts` | Mover + Rename | Barrel exports |

### Stores (Zustand)

| Origem | Destino | Tipo | Compatibilidade |
|--------|---------|------|-----------------|
| `src/stores/authStore.ts` | `packages/auth/src/stores/authStore.ts` | Mover | Barrel exports |
| `src/stores/unifiedProjectStore.ts` | `packages/projects/src/stores/unifiedProjectStore.ts` | Mover | Barrel exports |
| `src/stores/adminStore.ts` | `apps/web/src/features/admin/stores/adminStore.ts` | Mover | Path alias |
| `src/stores/crmStore.ts` | `apps/web/src/features/crm/stores/crmStore.ts` | Mover | Path alias |

### Services & Utilities

| Origem | Destino | Tipo | Compatibilidade |
|--------|---------|------|-----------------|
| `src/lib/utils.ts` | `packages/core/src/utils/index.ts` | Mover | Barrel exports |
| `src/lib/agents/*` | `packages/ai/src/agents/*` | Mover | Barrel exports |
| `src/lib/validations/*` | `packages/core/src/validation/*` | Mover | Barrel exports |
| `src/integrations/supabase/*` | `modules/database/*` | Mover | Path alias |

### Configuration Files

| Origem | Destino | Tipo | Compatibilidade |
|--------|---------|------|-----------------|
| `tailwind.config.ts` | `packages/ui/tailwind.config.ts` | Mover + Extend | Config inheritance |
| `vite.config.ts` | `apps/web/vite.config.ts` | Mover | Package-specific |
| `tsconfig.json` | `tsconfig.json` (root) + individual configs | Extend | Project references |
| `package.json` | Root + individual packages | Split | Workspace |

---

## 🛡️ Estratégias de Migração Segura

### Fase 1: Preparação (Sem Breaking Changes)

#### 1.1 Configuração Workspace
```bash
# Criar estrutura de pastas
mkdir -p apps/web packages/{ui,core,auth,projects,ai,analytics} modules/{database,email,monitoring}

# Configurar workspace
echo 'packages:\n  - "apps/*"\n  - "packages/*"\n  - "modules/*"' > pnpm-workspace.yaml
```

#### 1.2 Configuração TypeScript
```json
// tsconfig.json (root)
{
  "files": [],
  "references": [
    { "path": "./apps/web" },
    { "path": "./packages/ui" },
    { "path": "./packages/core" },
    { "path": "./packages/auth" },
    { "path": "./packages/projects" },
    { "path": "./packages/ai" },
    { "path": "./packages/analytics" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@madenai/*": ["./packages/*/src"]
    }
  }
}
```

#### 1.3 Pacotes Individuais package.json
```json
// packages/ui/package.json
{
  "name": "@madenai/ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

### Fase 2: Migração Gradual (Com Compatibilidade)

#### 2.1 Componentes UI (Prioridade 1)
```bash
# Mover componentes UI mantendo compatibilidade
cp -r src/components/ui/* packages/ui/src/components/
```

```typescript
// packages/ui/src/index.ts
export * from './components/Button';
export * from './components/Card';
export * from './components/Input';
// ... todos os componentes

// apps/web/src/components/ui/index.ts (compatibilidade temporária)
export * from '@madenai/ui';
```

#### 2.2 Autenticação (Prioridade 2)
```bash
# Mover módulo de autenticação
cp -r src/components/auth/* packages/auth/src/components/
cp -r src/hooks/useAuth.ts packages/auth/src/hooks/
cp -r src/stores/authStore.ts packages/auth/src/stores/
```

#### 2.3 Projetos (Prioridade 3)
```bash
# Mover módulo de projetos
cp -r src/components/project/* packages/projects/src/components/
cp -r src/hooks/useProjects.ts packages/projects/src/hooks/
cp -r src/stores/unifiedProjectStore.ts packages/projects/src/stores/
```

### Fase 3: Limpeza e Otimização

#### 3.1 Remover Arquivos Antigos
```bash
# Após confirmar que tudo funciona
rm -rf src/components/ui
rm -rf src/components/auth
rm -rf src/components/project
```

#### 3.2 Atualizar Importações
```bash
# Script automático para atualizar imports
find apps/web/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/@\/components\/ui/@madenai\/ui/g'
find apps/web/src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/@\/components\/auth/@madenai\/auth/g'
```

---

## ⚠️ Riscos e Mitigações

### Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Circular Dependencies** | Média | Alto | Análise dependências + Linting |
| **Type Resolution Issues** | Alta | Médio | Project references + Path mapping |
| **Bundle Size Increase** | Baixa | Médio | Tree-shaking + Bundle analysis |
| **Hot Reload Breaking** | Média | Baixo | Workspace dev scripts |
| **Import Resolution** | Alta | Alto | Gradual migration + Compatibility layer |

### Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Downtime durante migração** | Baixa | Alto | Feature flags + Rollback plan |
| **Perda de funcionalidade** | Baixa | Crítico | Smoke tests + E2E tests |
| **Performance degradation** | Média | Alto | Performance monitoring |
| **Developer productivity** | Alta | Médio | Training + Documentation |

### Plano de Mitigação

#### 1. Dependency Analysis
```bash
# Instalar ferramenta análise dependências
npm install -g madge

# Analisar dependências circulares
madge --circular --extensions ts,tsx src/

# Gerar grafo dependências
madge --image deps.svg src/
```

#### 2. Automated Testing
```bash
# Executar smoke tests antes da migração
node tests/smoke/runner.js

# Executar testes após cada fase
npm run test
npm run test:e2e
npm run smoke-test
```

#### 3. Performance Monitoring
```typescript
// tools/scripts/bundle-analysis.ts
import { analyzeBundle } from './utils/bundle-analyzer';

// Comparar tamanho bundle antes/depois
const beforeSize = await analyzeBundle('build-before/');
const afterSize = await analyzeBundle('build-after/');

console.log(`Bundle size change: ${afterSize - beforeSize}kb`);
```

---

## 🧪 Plano de Testes e Validação

### 1. Testes Automatizados

#### Smoke Tests (Existentes)
```bash
# Executar smoke tests atuais
node tests/smoke/runner.js

# Verificações específicas pós-migração
node tests/smoke/routes.test.js    # Rotas funcionando
node tests/smoke/imports.test.js   # Imports resolvendo
```

#### Testes de Integração
```typescript
// tests/integration/module-integration.test.ts
describe('Module Integration Tests', () => {
  it('should import UI components correctly', () => {
    const { Button } = require('@madenai/ui');
    expect(Button).toBeDefined();
  });

  it('should import auth hooks correctly', () => {
    const { useAuth } = require('@madenai/auth');
    expect(useAuth).toBeDefined();
  });

  it('should maintain cross-module communication', () => {
    // Testar comunicação entre módulos
  });
});
```

#### Bundle Analysis Tests
```typescript
// tests/performance/bundle-size.test.ts
describe('Bundle Size Tests', () => {
  it('should not increase bundle size significantly', async () => {
    const bundleSize = await getBundleSize();
    expect(bundleSize).toBeLessThan(PREVIOUS_SIZE * 1.1); // Max 10% increase
  });

  it('should maintain tree-shaking effectiveness', () => {
    // Verificar tree-shaking funciona
  });
});
```

### 2. Validação Manual

#### Checklist Funcional
- [ ] Login/logout funcionando
- [ ] Criação de projetos funcionando
- [ ] Upload de arquivos funcionando
- [ ] IA conversas funcionando
- [ ] CRM funcionando
- [ ] Admin panel funcionando
- [ ] Responsividade mantida
- [ ] Dark/light mode funcionando

#### Checklist Performance
- [ ] Hot reload funcionando
- [ ] Build time aceitável (<5min)
- [ ] Bundle size não aumentou >10%
- [ ] Lighthouse score mantido
- [ ] Core Web Vitals mantidos

#### Checklist Developer Experience
- [ ] Auto-complete funcionando
- [ ] Type checking funcionando
- [ ] Linting funcionando
- [ ] Imports resolving corretamente
- [ ] Dev server iniciando <30s

### 3. Validação de Contratos

#### API Contracts
```typescript
// tests/contracts/api-contracts.test.ts
describe('API Contracts', () => {
  it('should maintain Supabase client interface', () => {
    const client = createSupabaseClient();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeFunction();
  });

  it('should maintain store interfaces', () => {
    const authStore = useAuthStore();
    expect(authStore.user).toBeDefined();
    expect(authStore.login).toBeFunction();
  });
});
```

#### Component Contracts
```typescript
// tests/contracts/component-contracts.test.ts
describe('Component Contracts', () => {
  it('should maintain Button component interface', () => {
    render(<Button onClick={jest.fn()}>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should maintain form components interfaces', () => {
    // Testar interfaces de formulários
  });
});
```

---

## 📈 Cronograma de Execução

### Semana 1: Preparação
- **Dia 1-2:** Setup workspace e configurações
- **Dia 3-4:** Migrar pacote UI (@madenai/ui)
- **Dia 5:** Testes e validação UI

### Semana 2: Módulos Core
- **Dia 1-2:** Migrar core utilities (@madenai/core)
- **Dia 3-4:** Migrar módulo auth (@madenai/auth)
- **Dia 5:** Testes e validação core/auth

### Semana 3: Módulos Específicos
- **Dia 1-2:** Migrar módulo projects (@madenai/projects)
- **Dia 3-4:** Migrar módulo AI (@madenai/ai)
- **Dia 5:** Testes e validação projects/AI

### Semana 4: Finalização
- **Dia 1-2:** Migrar módulos restantes (analytics, database)
- **Dia 3-4:** Limpeza e otimização
- **Dia 5:** Testes finais e documentação

---

## 🔧 Ferramentas de Apoio

### Scripts de Migração

#### 1. Dependency Scanner
```typescript
// tools/scripts/dependency-scanner.ts
import { scanDependencies } from './utils/scanner';

// Escanear dependências circulares
const circularDeps = await scanDependencies('src/', {
  circular: true,
  extensions: ['.ts', '.tsx']
});

console.log('Circular dependencies found:', circularDeps);
```

#### 2. Import Updater
```typescript
// tools/scripts/import-updater.ts
import { updateImports } from './utils/import-updater';

// Atualizar imports automaticamente
await updateImports('apps/web/src/', {
  '@/components/ui': '@madenai/ui',
  '@/components/auth': '@madenai/auth',
  '@/hooks/useAuth': '@madenai/auth',
});
```

#### 3. Bundle Analyzer
```typescript
// tools/scripts/bundle-analyzer.ts
import { analyzeBundles } from './utils/bundle-analyzer';

// Comparar bundles antes/depois
const analysis = await analyzeBundles({
  before: 'dist-before/',
  after: 'dist-after/'
});

console.log('Bundle analysis:', analysis);
```

### Linting Rules

#### ESLint Configuration
```json
// .eslintrc.json
{
  "rules": {
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "import/order": ["error", {
      "groups": [
        "builtin",
        "external", 
        "internal",
        "parent",
        "sibling"
      ],
      "pathGroups": [
        {
          "pattern": "@madenai/**",
          "group": "internal",
          "position": "before"
        }
      ]
    }]
  }
}
```

---

## 📚 Documentação Atualizada

### 1. README.md Updates
```markdown
# MadenAI - Estrutura Modular

## Arquitetura

Este projeto utiliza uma arquitetura modular com workspace:

- `apps/web/` - Frontend React
- `packages/` - Pacotes reutilizáveis
- `modules/` - Módulos infraestrutura

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Desenvolver
pnpm dev

# Build
pnpm build
```

## Importações

```typescript
// Componentes UI
import { Button, Card } from '@madenai/ui';

// Autenticação
import { useAuth, AuthProvider } from '@madenai/auth';

// Projetos
import { useProjects, ProjectCard } from '@madenai/projects';
```
```

### 2. Contributing Guidelines
```markdown
# Contribuindo

## Estrutura de Módulos

Ao adicionar funcionalidades:

1. **UI Components:** `packages/ui/`
2. **Business Logic:** `packages/[domain]/`
3. **App-specific:** `apps/web/src/features/`

## Regras de Importação

- Nunca importar de `apps/` para `packages/`
- Usar barrel exports (`index.ts`)
- Seguir convenções de nomenclatura
```

---

## 🎯 Critérios de Sucesso

### Métricas Técnicas

| Métrica | Atual | Meta | Como Medir |
|---------|-------|------|------------|
| **Build Time** | ~2min | <3min | CI/CD logs |
| **Bundle Size** | ~2.5MB | <2.8MB | Webpack bundle analyzer |
| **Type Check Time** | ~30s | <45s | TypeScript compiler |
| **Test Coverage** | 75% | >75% | Jest coverage reports |
| **Circular Dependencies** | 5 | 0 | Madge analysis |

### Métricas de Qualidade

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **No Breaking Changes** | 100% | Smoke tests passing |
| **Import Resolution** | 100% | TypeScript compilation |
| **Hot Reload** | <3s | Dev server metrics |
| **Developer Onboarding** | <1h | Time to first contribution |

### Critérios de Rollback

Se qualquer uma das condições abaixo for verdadeira, fazer rollback:

1. **Smoke tests falhando** - Funcionalidade básica quebrada
2. **Build time >5min** - Performance inaceitável
3. **Bundle size >3MB** - Impacto usuário significativo
4. **Circular dependencies >2** - Arquitetura comprometida
5. **Type errors >10** - TypeScript quebrado

---

## 🔄 Plano de Rollback

### Estratégia de Rollback

#### 1. Rollback Completo (Emergency)
```bash
# Restaurar de backup Git
git checkout backup-branch-before-refactor
git push origin main --force

# Restaurar package.json original
cp backup/package.json .
cp backup/tsconfig.json .

# Reinstalar dependências
rm -rf node_modules
npm install
```

#### 2. Rollback Parcial (Gradual)
```bash
# Reverter apenas pacotes problemáticos
git checkout HEAD~1 -- packages/problematic-package/
git commit -m "Rollback problematic package"

# Atualizar imports para versão anterior
node tools/scripts/rollback-imports.js
```

#### 3. Rollback com Preserve (Selective)
```bash
# Manter mudanças que funcionam
git cherry-pick <working-commits>

# Reverter apenas mudanças problemáticas
git revert <problematic-commits>
```

---

## 🚀 Benefícios Esperados

### Desenvolvimento
- **Onboarding 50% mais rápido** - Estrutura clara e documentada
- **Desenvolvimento paralelo** - Equipes trabalham em módulos independentes
- **Reutilização de código** - Componentes e hooks compartilhados
- **Debugging simplificado** - Isolamento de responsabilidades

### Performance
- **Tree-shaking otimizado** - Imports específicos por módulo
- **Hot reload mais rápido** - Apenas módulos alterados recompilam
- **Bundle splitting** - Chunks menores e mais eficientes
- **Lazy loading** - Módulos carregados sob demanda

### Manutenção
- **Testes isolados** - Cada módulo tem seus próprios testes
- **Dependencies claras** - Grafo de dependências explícito
- **Refactoring seguro** - Mudanças isoladas em módulos
- **Scaling preparado** - Arquitetura para crescimento

---

## 📞 Suporte e Contatos

### Responsáveis
- **Tech Lead:** Responsável por arquitetura e decisões técnicas
- **DevOps:** Responsável por CI/CD e deployment
- **QA Lead:** Responsável por estratégia de testes

### Canais de Comunicação
- **Slack:** #refactoring-project
- **Daily Standups:** Status updates diários
- **Weekly Reviews:** Revisão semanal de progresso

---

## 📋 Anexos

### A. Exemplo de Package.json Completo
```json
{
  "name": "@madenai/ui",
  "version": "1.0.0",
  "description": "MadenAI Design System",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css"
  },
  "scripts": {
    "build": "tsc && rollup -c",
    "dev": "tsc --watch",
    "lint": "eslint src/",
    "test": "jest"
  },
  "dependencies": {
    "@radix-ui/react-button": "^1.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

### B. Exemplo de TSConfig Individual
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

---

**Status:** 📋 PLANO APROVADO PARA EXECUÇÃO  
**Próximo Passo:** Implementação Fase 1 (Setup Workspace)  
**Data de Revisão:** 2025-09-01  
**Versão do Documento:** 1.0