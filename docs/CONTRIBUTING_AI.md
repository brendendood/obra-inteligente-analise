# 🤖 CONTRIBUTING_AI.md - Diretrizes para IA

> **Data:** 2025-08-25  
> **Objetivo:** Estabelecer regras claras para interações de IA com o codebase MadenAI  
> **Modo:** ULTRA SEGURO - Prevenção de regressões e breaking changes

## 🚨 REGRAS FUNDAMENTAIS

### ❌ **ARQUIVO PROIBIDO**
```bash
/archive/**
```
**⚠️ NUNCA ACESSAR, LER OU REFERENCIAR** arquivos da pasta `/archive`.
- Contém código **DEPRECIADO** e **NÃO FUNCIONAL**
- Pode causar **confusão** e **regressões**
- **IGNORAR COMPLETAMENTE** em buscas e análises

### ✅ **FONTE DE VERDADE ABSOLUTA**
```bash
📋 /docs/inventory/INCLUSION_RULES.md
```
**SEMPRE CONSULTAR PRIMEIRO** antes de qualquer mudança:
- Define **arquitetura aprovada**
- Lista **componentes autorizados** 
- Especifica **padrões obrigatórios**
- Identifica **código legacy** a evitar

## 🏗️ LIMITES ARQUITETURAIS

### 📐 **Boundaries e Contratos**
```bash
📋 /docs/architecture/BOUNDARIES.md  (quando existir)
📋 /contracts/**/*.md
```

**RESPEITAR SEMPRE:**
- Contratos de API existentes
- Boundaries entre módulos
- Interfaces públicas definidas
- Tipos TypeScript estabelecidos

### 🔒 **Áreas de Alto Risco**
```typescript
❌ NÃO ALTERAR SEM REVISÃO MANUAL:
├── src/integrations/supabase/     # Integrações críticas
├── src/stores/unifiedProjectStore.ts  # Estado global crítico
├── src/contexts/AuthProvider.tsx      # Autenticação
├── src/utils/agents/                  # Sistema de IA
├── supabase/migrations/               # Banco de dados
└── src/types/                         # Tipos compartilhados
```

## ✅ CHECKLIST PRÉ-PRODUÇÃO

### 🔍 **Antes de Propor Mudanças**

#### 1. **📋 Validação de Arquitetura**
- [ ] ✅ Consultei `/docs/inventory/INCLUSION_RULES.md`
- [ ] ✅ Mudança está alinhada com arquitetura aprovada
- [ ] ✅ Não estou tocando em código legacy listado como ❌
- [ ] ✅ Estou usando componentes da lista ✅

#### 2. **🔒 Validação de Segurança**
- [ ] ✅ Não expus tokens/secrets no frontend
- [ ] ✅ Mantive validação backend + frontend
- [ ] ✅ Usei RLS em tabelas Supabase (se aplicável)
- [ ] ✅ Sanitizei dados de entrada (se aplicável)

#### 3. **🧪 Validação Técnica**
- [ ] ✅ TypeScript strict passa sem erros
- [ ] ✅ ESLint não reporta erros críticos
- [ ] ✅ Build completa com sucesso
- [ ] ✅ Smoke tests básicos funcionam

#### 4. **📊 Validação de Impacto**
- [ ] ✅ Identifiquei todos os arquivos afetados
- [ ] ✅ Considerei backward compatibility
- [ ] ✅ Documentei breaking changes (se houver)
- [ ] ✅ Preparei rollback plan

#### 5. **🎯 Validação de Escopo**
- [ ] ✅ Mudança é **minimal** e **focada**
- [ ] ✅ Não estou fazendo refatoração desnecessária
- [ ] ✅ Mantive **mesmo comportamento** externamente
- [ ] ✅ Não alterei APIs públicas sem necessidade

## 📚 HIERARQUIA DE FONTES

### 🥇 **Prioridade 1 - FONTE DE VERDADE**
1. `/docs/inventory/INCLUSION_RULES.md` - **ABSOLUTA**
2. `/contracts/` - Contratos de API
3. `src/integrations/supabase/types.ts` - Tipos do banco

### 🥈 **Prioridade 2 - DOCUMENTAÇÃO OFICIAL**
1. `/docs/architecture/` - Documentação de arquitetura
2. `/docs/refactor/` - Histórico de refatorações
3. `/docs/inventory/` - Inventários e políticas

### 🥉 **Prioridade 3 - CÓDIGO FONTE**
1. `src/` (exceto legacy identificado)
2. `package.json` e configurações
3. Testes existentes

### 🚫 **Prioridade ZERO - IGNORAR**
1. `/archive/**` - **NUNCA CONSULTAR**
2. Código marcado como ❌ em INCLUSION_RULES
3. Comentários TODO/FIXME antigos

## 🎨 PADRÕES OBRIGATÓRIOS

### 📁 **Estrutura de Arquivos**
```typescript
✅ USAR:
├── PascalCase para componentes: UserProfile.tsx
├── camelCase para hooks: useUserData.ts  
├── camelCase para stores: authStore.ts
├── kebab-case para UI: input-otp.tsx
└── UPPER_CASE para constants: API_ENDPOINTS.ts

❌ EVITAR:
├── snake_case em TypeScript
├── Estruturas não padronizadas
└── Naming inconsistente
```

### 🔧 **Imports e Exports**
```typescript
✅ USAR:
import { Component } from '@/components/ui';     // Facades/barrels
import { useAuth } from '@/hooks/useAuth';       // Hooks oficiais
import type { User } from '@/types/user';       // Type imports

❌ EVITAR:
import Component from '@/components/ui/button';  // Deep imports
import * as Everything from '@/utils';          // Wildcard imports
```

### 🎯 **Estado e Gerenciamento**
```typescript
✅ USAR:
├── useUnifiedProjectStore()    # Projetos
├── useAuth()                   # Autenticação  
├── React Query para API        # Server state
└── Zustand para client state   # Global state

❌ EVITAR:
├── useState para dados globais
├── Context para tudo
├── localStorage manual
└── Stores legacy (projectStore)
```

## 🚀 FLUXO DE TRABALHO SEGURO

### 1. **🔍 ANÁLISE INICIAL**
```bash
1. Ler user request
2. Consultar /docs/inventory/INCLUSION_RULES.md
3. Verificar se mudança é permitida
4. Identificar arquivos afetados
5. Checar contracts/ se aplicável
```

### 2. **📋 PLANEJAMENTO**
```bash
1. Listar mudanças necessárias
2. Verificar compatibilidade
3. Preparar rollback plan
4. Documentar impactos
5. Validar com checklist
```

### 3. **🔧 IMPLEMENTAÇÃO**
```bash
1. Fazer mudanças minimais
2. Testar TypeScript compilation
3. Verificar imports/exports
4. Validar comportamento
5. Documentar alterações
```

### 4. **✅ VALIDAÇÃO**
```bash
1. Build completo
2. Smoke tests
3. Verificar logs de erro
4. Confirmar comportamento inalterado
5. Documentar resultado
```

## 🆘 SITUAÇÕES DE EMERGÊNCIA

### 🚨 **SE ALGO QUEBRAR**
1. **PARAR IMEDIATAMENTE** mudanças adicionais
2. **DOCUMENTAR** o erro exato
3. **REVERTER** usando rollback plan
4. **INVESTIGAR** causa raiz na fonte de verdade
5. **REPLICATION** da correção

### 🔄 **ROLLBACK AUTOMÁTICO**
```bash
# Critérios para rollback imediato:
- Build falha
- TypeScript errors críticos  
- Runtime errors no console
- Smoke tests falham
- User flow básico quebra
```

## 📖 RECURSOS DE CONSULTA

### 🎯 **Documentos Essenciais**
```bash
📋 /docs/inventory/INCLUSION_RULES.md     # MAIS IMPORTANTE
📋 /contracts/openapi/SNAPSHOT_*.md       # Contratos atuais
📋 /docs/refactor/FACADES_REPORT_*.md     # Padrões facades
📋 /docs/inventory/ARCHIVE_POLICY.md      # Política de arquivo
```

### 🔧 **Código de Referência**
```bash
✅ src/stores/unifiedProjectStore.ts      # Estado de projetos
✅ src/contexts/AuthProvider.tsx          # Autenticação
✅ src/components/ui/                     # UI components
✅ src/hooks/useAuth.ts                   # Auth hook principal
```

### 🚫 **Nunca Referenciar**
```bash
❌ /archive/**                           # Código depreciado
❌ src/stores/projectStore.ts             # Legacy store
❌ src/pages/Projects.tsx                 # Página descontinuada
❌ Hooks marcados como ❌ em INCLUSION_RULES
```

## 🎖️ BOAS PRÁTICAS

### ✅ **SEMPRE FAZER**
- Consultar INCLUSION_RULES antes de mudanças
- Usar facades/barrels quando disponíveis  
- Manter backward compatibility
- Documentar breaking changes
- Testar imports após mudanças
- Verificar TypeScript strict

### ❌ **NUNCA FAZER**
- Acessar pasta /archive
- Usar código marcado como legacy
- Fazer refatoração desnecessária
- Alterar APIs sem documentar
- Pular validação de build
- Ignorar warnings críticos

### ⚠️ **COM CUIDADO**
- Mudanças em stores globais
- Alterações em tipos compartilhados
- Modificações no sistema de auth
- Refatorações em módulos core

## 🏁 RESUMO EXECUTIVO

### 🎯 **REGRA DE OURO**
> **"Quando em dúvida, consulte INCLUSION_RULES.md e prefira não mudar a não agir incorretamente."**

### 📐 **PRIORIDADES**
1. **SEGURANÇA** - Não quebrar nada existente
2. **CONSISTÊNCIA** - Seguir padrões estabelecidos  
3. **SIMPLICIDADE** - Mudanças mínimas necessárias
4. **DOCUMENTAÇÃO** - Registrar todas as alterações

### 🚀 **OBJETIVOS**
- ✅ Manter estabilidade do sistema
- ✅ Preservar arquitetura aprovada
- ✅ Evitar regressões e bugs
- ✅ Facilitar manutenção futura

---

**🤖 Para IAs:** Este documento é sua **bíblia**. Consulte-o **SEMPRE** antes de propor mudanças no codebase MadenAI.

*Última atualização: 25/08/2025*