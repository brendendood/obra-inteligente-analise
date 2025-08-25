# 🔄 MadenAI Refactor - Move Plan

> ⚠️ **IMPORTANTE**: Este é um documento de **PLANEJAMENTO APENAS**. Nenhuma movimentação foi executada.

**Status**: Planejamento  
**Data**: 2025-08-25  
**Autor**: MadenAI Architecture Team

## 📋 Resumo Executivo

Este documento define a **estratégia de refatoração** para reorganizar a estrutura de arquivos do MadenAI seguindo princípios de:

- ✅ **Separação clara de responsabilidades**
- ✅ **Boundaries arquiteturais definidos**
- ✅ **Facilidade de manutenção e testes**
- ✅ **Compatibilidade durante transição**

## 🎯 Estrutura-Alvo Proposta

### 📁 **Nova Organização**

```
src/
├── 📱 apps/                    # Aplicações principais
│   ├── web/                   # App web principal
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── layouts/           # Layouts e shells
│   │   └── router/            # Configuração de rotas
│   ├── admin/                 # Painel administrativo
│   │   ├── pages/
│   │   ├── components/
│   │   └── router/
│   └── mobile/                # App mobile (futuro)
│
├── 🧩 modules/                 # Módulos de domínio
│   ├── auth/                  # Módulo de autenticação
│   │   ├── components/        # UI específica de auth
│   │   ├── hooks/             # Hooks de auth
│   │   ├── services/          # Lógica de negócio
│   │   ├── types/             # Types específicos
│   │   └── index.ts           # Barrel export
│   ├── projects/              # Módulo de projetos
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── budget/                # Módulo de orçamento
│   ├── schedule/              # Módulo de cronograma
│   ├── ai-assistant/          # Módulo do assistente IA
│   └── documents/             # Módulo de documentos
│
├── 🎭 facades/                 # Camada de abstração
│   ├── auth/
│   │   ├── AuthFacade.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── storage/
│   ├── ai/
│   └── analytics/
│
├── 🔗 integrations/            # Integrações externas
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── types.ts
│   │   └── helpers/
│   ├── n8n/
│   │   ├── webhooks.ts
│   │   ├── client.ts
│   │   └── types.ts
│   └── external-apis/
│
├── 🏗️ infra/                   # Infraestrutura e configuração
│   ├── config/                # Configurações da aplicação
│   ├── constants/             # Constantes globais
│   ├── providers/             # Providers React (Context, Query, etc.)
│   ├── router/                # Router base e guards
│   └── theme/                 # Theme e design system
│
├── 🧪 __tests__/               # Testes organizados por tipo
│   ├── unit/                  # Testes unitários
│   ├── integration/           # Testes de integração
│   ├── e2e/                   # Testes end-to-end
│   └── fixtures/              # Dados de teste
│
├── 🔧 shared/                  # Código compartilhado
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/                # Design system base
│   │   ├── forms/             # Componentes de formulário
│   │   ├── charts/            # Componentes de gráfico
│   │   └── layout/            # Componentes de layout
│   ├── hooks/                 # Hooks genéricos
│   ├── utils/                 # Utilitários puros
│   ├── types/                 # Types globais
│   └── lib/                   # Bibliotecas específicas
│
└── 📊 assets/                  # Assets estáticos
    ├── images/
    ├── icons/
    ├── fonts/
    └── styles/
```

## 🗺️ Matriz de Movimentação (Origem → Destino)

### 📄 **Pages**
```
ORIGEM                          → DESTINO
src/pages/Dashboard.tsx         → src/apps/web/pages/Dashboard.tsx
src/pages/Projects.tsx          → src/apps/web/pages/Projects.tsx
src/pages/Budget.tsx            → src/modules/budget/pages/Budget.tsx
src/pages/Schedule.tsx          → src/modules/schedule/pages/Schedule.tsx
src/pages/Assistant.tsx         → src/modules/ai-assistant/pages/Assistant.tsx
src/pages/Documents.tsx         → src/modules/documents/pages/Documents.tsx
src/pages/admin/               → src/apps/admin/pages/
```

### 🧩 **Components**
```
ORIGEM                          → DESTINO
src/components/ui/             → src/shared/components/ui/
src/components/forms/          → src/shared/components/forms/
src/components/charts/         → src/shared/components/charts/
src/components/layout/         → src/shared/components/layout/
src/components/auth/           → src/modules/auth/components/
src/components/project/        → src/modules/projects/components/
```

### 🎣 **Hooks**
```
ORIGEM                          → DESTINO
src/hooks/useAuth.ts           → src/modules/auth/hooks/useAuth.ts
src/hooks/useProjects.ts       → src/modules/projects/hooks/useProjects.ts
src/hooks/useBudget.ts         → src/modules/budget/hooks/useBudget.ts
src/hooks/useLocalStorage.ts   → src/shared/hooks/useLocalStorage.ts
src/hooks/useDebounce.ts       → src/shared/hooks/useDebounce.ts
```

### 🌍 **Contexts**
```
ORIGEM                          → DESTINO
src/contexts/AuthContext.tsx   → src/modules/auth/context/AuthContext.tsx
src/contexts/ProjectContext.tsx → src/modules/projects/context/ProjectContext.tsx
src/contexts/ThemeContext.tsx  → src/infra/providers/ThemeProvider.tsx
```

### 🔗 **Integrations**
```
ORIGEM                          → DESTINO
src/integrations/supabase/     → src/integrations/supabase/ (mantém)
src/integrations/n8n/          → src/integrations/n8n/ (mantém)
src/lib/supabase.ts            → src/integrations/supabase/client.ts
```

### 🔧 **Utils**
```
ORIGEM                          → DESTINO
src/utils/validation.ts        → src/shared/utils/validation.ts
src/utils/formatting.ts        → src/shared/utils/formatting.ts
src/utils/constants.ts         → src/infra/constants/app.ts
src/utils/securityValidation.ts → src/shared/utils/security.ts
```

### 🎭 **Facades** (Novos)
```
ORIGEM                          → DESTINO
[Novo] AuthFacade              → src/facades/auth/AuthFacade.ts
[Novo] ProjectFacade           → src/facades/projects/ProjectFacade.ts
[Novo] AIFacade                → src/facades/ai/AIFacade.ts
[Novo] StorageFacade           → src/facades/storage/StorageFacade.ts
```

## 🔧 Estratégias de Compatibilidade

### 📦 **Barrel Exports**

Cada módulo terá um `index.ts` que exporta sua API pública:

```typescript
// src/modules/auth/index.ts
export { useAuth } from './hooks/useAuth'
export { LoginForm } from './components/LoginForm'
export { AuthProvider } from './context/AuthContext'
export type { User, AuthState } from './types'

// src/facades/auth/index.ts
export { AuthFacade } from './AuthFacade'
export type { LoginCredentials, AuthResult } from './types'
```

### 🎭 **Facade Pattern**

Facades abstraem complexidade e fornecem API estável:

```typescript
// src/facades/auth/AuthFacade.ts
export class AuthFacade {
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    // Implementação usando integrations
  }
  
  static async logout(): Promise<void> {
    // Implementação
  }
}
```

### 🛤️ **TypeScript Path Mapping**

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/apps/*": ["src/apps/*"],
      "@/modules/*": ["src/modules/*"],
      "@/facades/*": ["src/facades/*"],
      "@/integrations/*": ["src/integrations/*"],
      "@/infra/*": ["src/infra/*"],
      "@/shared/*": ["src/shared/*"],
      "@/tests/*": ["src/__tests__/*"]
    }
  }
}
```

### 🔗 **Compatibility Layer**

Durante transição, mantém imports antigos funcionando:

```typescript
// src/hooks/index.ts (compatibility layer)
export { useAuth } from '@/modules/auth'
export { useProjects } from '@/modules/projects'
// ... outros exports para compatibilidade
```

## 📋 Estratégia de Migração por Fases

### 🎯 **Fase 1: Preparação** (1-2 dias)
1. **Criar estrutura de pastas** vazias
2. **Configurar TypeScript paths**
3. **Criar barrels vazios**
4. **Configurar tooling** (ESLint, etc.)

### 🎭 **Fase 2: Facades** (2-3 dias)
1. **Criar AuthFacade** encapsulando Supabase Auth
2. **Criar ProjectFacade** para operações de projeto
3. **Criar AIFacade** para integrações N8N
4. **Criar StorageFacade** para file operations

### 🔧 **Fase 3: Utils & Shared** (1-2 dias)
1. **Mover utils** para `src/shared/utils/`
2. **Mover components UI** para `src/shared/components/`
3. **Atualizar imports** para usar paths mapeados
4. **Testar compatibilidade**

### 🧩 **Fase 4: Modules** (3-4 dias)
1. **Mover auth module** completo
2. **Mover projects module**
3. **Mover budget module**
4. **Mover outros modules** gradualmente

### 📄 **Fase 5: Apps** (2-3 dias)
1. **Reorganizar pages** em apps
2. **Configurar routers** por app
3. **Ajustar layouts** e shells
4. **Testar navegação**

### 🧪 **Fase 6: Tests** (1-2 dias)
1. **Reorganizar testes** por tipo
2. **Atualizar imports** nos testes
3. **Configurar test runners**
4. **Validar coverage**

### 🧹 **Fase 7: Cleanup** (1 dia)
1. **Remover arquivos antigos**
2. **Remover compatibility layers**
3. **Atualizar documentação**
4. **Final validation**

## ⚠️ Riscos e Mitigações

### 🚨 **Riscos Altos**

#### 1. **Breaking Changes**
- **Risco**: Imports quebrados em toda aplicação
- **Mitigação**: Compatibility layers temporárias, migração gradual

#### 2. **Build Failures**
- **Risco**: TypeScript/Vite não resolve novos paths
- **Mitigação**: Testar configuração em branch separada

#### 3. **Test Failures**
- **Risco**: Testes não encontram módulos
- **Mitigação**: Atualizar jest/vitest config simultaneamente

#### 4. **Developer Confusion**
- **Risco**: Time não sabe onde encontrar código
- **Mitigação**: Documentação clara e onboarding

### ⚠️ **Riscos Médios**

#### 1. **Performance Impact**
- **Risco**: Barrel exports podem afetar tree-shaking
- **Mitigação**: Monitorar bundle size, usar exports específicos

#### 2. **Git History Loss**
- **Risco**: `git mv` pode quebrar blame/history
- **Mitigação**: Usar `git mv` adequadamente, documentar moves

#### 3. **IDE Support**
- **Risco**: VSCode pode não resolver paths corretamente
- **Mitigação**: Atualizar workspace settings

## ✅ Checklist Pós-Movimentação

### 🔍 **Build & Runtime**
- [ ] `npm run build` executa sem erros
- [ ] `npm run dev` inicia corretamente
- [ ] `npm run preview` funciona
- [ ] Todas as rotas carregam sem erro

### 🧪 **Tests**
- [ ] `npm run test` executa todos os testes
- [ ] Coverage mantido ou melhorado
- [ ] Smoke tests passam
- [ ] E2E tests funcionam

### 🛠️ **Tooling**
- [ ] ESLint não reporta erros de import
- [ ] TypeScript não tem erros de resolução
- [ ] VSCode resolve imports corretamente
- [ ] Git blame/history preservado onde possível

### 📊 **Performance**
- [ ] Bundle size não aumentou significativamente
- [ ] Tree-shaking ainda funciona
- [ ] Load times mantidos
- [ ] Memory usage aceitável

### 📚 **Documentation**
- [ ] README atualizado com nova estrutura
- [ ] CONTRIBUTING_AI.md atualizado
- [ ] Architecture docs atualizados
- [ ] Import examples atualizados

## 📊 Métricas de Sucesso

### ✅ **Quantitativas**
- **Zero** breaking changes em produção
- **< 10%** aumento no bundle size
- **100%** dos testes passando
- **< 5 min** adicional no build time

### ✅ **Qualitativas**
- **Clareza**: Desenvolvedores encontram código facilmente
- **Manutenibilidade**: Mudanças são mais localizadas
- **Testabilidade**: Módulos testáveis isoladamente
- **Onboarding**: Novos devs entendem estrutura rapidamente

## 🔄 Rollback Plan

Se movimentação causar problemas críticos:

### 🚨 **Rollback Imediato** (< 30 min)
1. **Git revert** dos commits de movimentação
2. **Restore** tsconfig.json anterior
3. **Rebuild** e test
4. **Deploy** versão anterior

### 📋 **Rollback Gradual** (1-2 horas)
1. **Manter nova estrutura** de pastas
2. **Restaurar imports antigos** via compatibility
3. **Fix** issues específicos um por vez
4. **Re-plan** movimentação com aprendizados

## 📞 Comunicação e Coordenação

### 👥 **Stakeholders**
- **Tech Lead**: Aprovação e coordenação
- **Senior Devs**: Review e implementação
- **QA Team**: Validação pós-migração
- **DevOps**: Support com CI/CD

### 📅 **Timeline**
- **Planning**: 1 semana
- **Implementation**: 2-3 semanas
- **Validation**: 1 semana
- **Documentation**: Paralelo

### 📢 **Communication Plan**
- **Daily standup**: Updates de progresso
- **Slack channel**: #refactor-move para discussões
- **Documentation**: Atualizada em tempo real
- **Demo**: Apresentação final para team

---

> ⚠️ **LEMBRETE**: Este é um **PLANO TEÓRICO**. Antes de executar qualquer movimentação:
> 1. **Review completo** do plano com team
> 2. **Backup** completo do projeto
> 3. **Branch dedicada** para movimentação
> 4. **Testes extensivos** antes de merge

**Próximos Passos**: Discussão em team meeting e refinamento do plano.