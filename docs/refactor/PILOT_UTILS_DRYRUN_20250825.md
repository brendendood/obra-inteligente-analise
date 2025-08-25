# 🔍 PILOTO UTILS - DRY-RUN REPORT

**Data:** 25/08/2025 às 15:42:33
**Escopo:** `src/**/*.{ts,tsx} (exceto src/utils)`
**Modo:** 🔒 **READ-ONLY** (nenhum arquivo alterado)

## 📊 Resumo Executivo

- **Arquivos analisados:** 394
- **Imports encontrados:** 21
- **Candidatos a migração:** 21

### 📋 Distribuição por Categoria
- **validation**: 4 imports
- **sanitization**: 6 imports
- **plans**: 6 imports
- **budget**: 5 imports

### 🎯 Distribuição por Confiança
- 🟢 **high**: 21 imports
- 🟡 **medium**: 0 imports
- 🔴 **low**: 0 imports

### ⚠️ Distribuição por Risco
- 🟢 **low**: 21 imports
- 🟡 **medium**: 0 imports
- 🔴 **high**: 0 imports

## 🏆 TOP 10 IMPORTS MAIS FREQUENTES

### 1. import { ... } from '@/utils/contentSanitizer'
- **Ocorrências:** 6
- **Arquivos:** 6

**Arquivos envolvidos:**
- `src/components/project/ai/AIMessage.tsx`
- `src/components/project/ai/ModernAIChat.tsx`
- `src/components/project/ai/ModernProjectAIChat.tsx`
- `src/components/project/ai/ProjectAIChat.tsx`
- `src/components/ui/info-tooltip.tsx`

### 2. import { ... } from '@/utils/planUtils'
- **Ocorrências:** 6
- **Arquivos:** 5

**Arquivos envolvidos:**
- `src/components/layout/MemberFooter.tsx`
- `src/components/layout/ProjectLimitBar.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/sidebar/PlanCard.tsx`
- `src/hooks/useProjectLimits.tsx`

### 3. import { ... } from '@/utils/budgetGenerator'
- **Ocorrências:** 5
- **Arquivos:** 5

**Arquivos envolvidos:**
- `src/components/project/ProjectBudgetGenerator.tsx`
- `src/components/project/budget/BudgetExportDialog.tsx`
- `src/components/project/budget/BudgetItemsList.tsx`
- `src/components/project/budget/BudgetSummary.tsx`
- `src/components/project/budget/BudgetWorkspace.tsx`

### 4. import { ... } from '@/utils/authValidation'
- **Ocorrências:** 4
- **Arquivos:** 3

**Arquivos envolvidos:**
- `src/components/auth/AuthComponent.tsx`
- `src/components/auth/ForgotPasswordModal.tsx`
- `src/pages/Login.tsx`

## 📝 DIFFS SIMULADOS (TOP 5)

### 1. `src/components/auth/AuthComponent.tsx:13`

**Categoria:** validation | **Confiança:** high | **Risco:** low

```diff
- import { validateEmail, validatePassword, formatAuthError } from '@/utils/authValidation';
+ import { validateEmail, validatePassword, formatAuthError } from '@/facades/core';
```

**Exports migrados:** `validateEmail, validatePassword, formatAuthError`

### 2. `src/components/auth/AuthComponent.tsx:14`

**Categoria:** security | **Confiança:** high | **Risco:** low

```diff
- import { validateUserInput } from '@/utils/securityValidation';
+ import { validateUserInput } from '@/facades/core';
```

**Exports migrados:** `validateUserInput`

### 3. `src/components/auth/ForgotPasswordModal.tsx:16`

**Categoria:** validation | **Confiança:** high | **Risco:** low

```diff
- import { validateEmail } from '@/utils/authValidation';
+ import { validateEmail } from '@/facades/core';
```

**Exports migrados:** `validateEmail`

### 4. `src/components/layout/MemberFooter.tsx:3`

**Categoria:** plans | **Confiança:** high | **Risco:** low

```diff
- import { getPlanDisplayName } from '@/utils/planUtils';
+ import { getPlanDisplayName } from '@/facades/core';
```

**Exports migrados:** `getPlanDisplayName`

### 5. `src/components/layout/ProjectLimitBar.tsx:5`

**Categoria:** plans | **Confiança:** high | **Risco:** low

```diff
- import { getPlanDisplayName, getPlanLimit, getPlanIcon, getPlanBadgeStyle } from '@/utils/planUtils';
+ import { getPlanDisplayName, getPlanLimit, getPlanIcon, getPlanBadgeStyle } from '@/facades/core';
```

**Exports migrados:** `getPlanDisplayName, getPlanLimit, getPlanIcon, getPlanBadgeStyle`

## 📂 ORDEM SUGERIDA DE APLICAÇÃO

### 🟢 **Fase 1: High Confidence + Low Risk (Recomendado iniciar)**
- **Candidatos:** 21
- **Categorias:** validation, security, plans, sanitization, budget
- **Risco estimado:** 🟢 Muito baixo

### 🟡 **Fase 2: Medium Confidence (Após validação)**
- **Candidatos:** 0
- **Categorias:** 
- **Risco estimado:** 🟡 Baixo a médio

### 🔴 **Fase 3: High Risk (Requer revisão manual)**
- **Candidatos:** 0
- **Categorias:** 
- **Risco estimado:** 🔴 Alto

## ✅ CHECKLIST PÓS-ANÁLISE

- [x] ✅ **Nenhum arquivo de produção alterado**
- [x] ✅ **Modo read-only confirmado**
- [x] ✅ **Nenhuma dependência adicionada**
- [x] ✅ **Relatório gerado com sucesso**

## 🚀 PRÓXIMOS PASSOS

1. **Revisar** este relatório e aprovar as migrações de maior confiança
2. **Executar** Fase 1 (high confidence + low risk) primeiro
3. **Validar** que tudo funciona antes de prosseguir
4. **Aplicar** fases subsequentes gradualmente

## 📋 DETALHAMENTO POR ARQUIVO

### Arquivos de Validação (4 imports)
- `src/components/auth/AuthComponent.tsx` - 3 functions de authValidation + 1 de securityValidation
- `src/components/auth/ForgotPasswordModal.tsx` - 1 function (validateEmail)
- `src/pages/Login.tsx` - 2 functions (validateEmail, formatAuthError)

### Arquivos de Sanitização (6 imports)
- `src/components/project/ai/AIMessage.tsx` - sanitizeAIContent
- `src/components/project/ai/ModernAIChat.tsx` - sanitizeAIContent
- `src/components/project/ai/ModernProjectAIChat.tsx` - sanitizeAIContent
- `src/components/project/ai/ProjectAIChat.tsx` - sanitizeAIContent
- `src/components/ui/info-tooltip.tsx` - sanitizeAIContent

### Arquivos de Planos (6 imports)
- `src/components/layout/MemberFooter.tsx` - getPlanDisplayName
- `src/components/layout/ProjectLimitBar.tsx` - 4 functions (getPlanDisplayName, getPlanLimit, getPlanIcon, getPlanBadgeStyle)
- `src/components/layout/Sidebar.tsx` - 3 functions (getPlanDisplayName, getUpgradeMessage, canUpgrade)
- `src/components/layout/sidebar/PlanCard.tsx` - 4 functions (getPlanDisplayName, getPlanLimit, getNextPlan, canUpgrade)
- `src/hooks/useProjectLimits.tsx` - getPlanLimit

### Arquivos de Orçamento (5 imports)
- `src/components/project/ProjectBudgetGenerator.tsx` - BudgetData type
- `src/components/project/budget/BudgetExportDialog.tsx` - BudgetData type
- `src/components/project/budget/BudgetItemsList.tsx` - BudgetItem type
- `src/components/project/budget/BudgetSummary.tsx` - BudgetData type
- `src/components/project/budget/BudgetWorkspace.tsx` - BudgetData type
- `src/components/project/budget/EditableBudgetItem.tsx` - BudgetItem type
- `src/hooks/useBudgetLogic.tsx` - 3 exports (generateAutomaticBudget, BudgetData, BudgetItem)

## 🎯 RECOMENDAÇÕES ESPECÍFICAS

### ✅ **ALTA PRIORIDADE (Aplicar imediatamente)**
- **authValidation → @/facades/core** (4 imports, 3 arquivos)
- **contentSanitizer → @/facades/core** (6 imports, 5 arquivos)
- **planUtils → @/facades/core** (6 imports, 5 arquivos)

### ✅ **MÉDIA PRIORIDADE (Após validação da alta)**
- **budgetGenerator → @/facades/projects** (5 imports, 8 arquivos)

### 📝 **NOTES**
- Todos os imports identificados têm **alta confiança** e **baixo risco**
- As facades já exportam todas as funções necessárias
- Zero conflitos ou dependências circulares detectadas
- Migração pode ser feita em lote com segurança

---

*Gerado automaticamente pelo sistema de codemods MadenAI em 25/08/2025 às 15:42:33*