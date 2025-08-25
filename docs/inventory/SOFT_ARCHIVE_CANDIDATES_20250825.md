# 📦 Candidatos a Soft Archive - Análise de Arquivamento
**Data:** 2025-08-25  
**Modo:** ULTRA SEGURO - Apenas identificação, sem movimentação  
**Objetivo:** Identificar arquivos candidatos ao arquivamento baseado em IGNORED_FILES.md

## 🎯 Metodologia de Análise

**Fonte:** Baseado em `docs/inventory/IGNORED_FILES.md`  
**Critério:** Arquivos explicitamente marcados como legacy, duplicados ou removidos  
**Status:** Análise de referência para determinar impacto real

---

## 🔴 CANDIDATOS CONFIRMADOS (Alta Prioridade)

### 📄 **Páginas Legacy Substituídas**

#### `src/pages/Projects.tsx`
- **Justificativa:** Substituído pelo Dashboard unificado (conforme IGNORED_FILES.md)
- **Substituir por:** `src/pages/Dashboard.tsx`
- **Status de Import:** ⚠️ **VERIFICAR** - Analisar se ainda é referenciado
- **Risco de Arquivamento:** 🟢 Baixo (substituto já existe)
- **Prioridade:** Alta - candidato ideal para soft archive

#### `src/pages/ProjectsPage.tsx`
- **Justificativa:** Duplicata de Projects.tsx (conforme IGNORED_FILES.md)
- **Substituir por:** `src/pages/Dashboard.tsx`
- **Status de Import:** ⚠️ **VERIFICAR** - Possível duplicação de imports
- **Risco de Arquivamento:** 🟢 Baixo (é duplicata)
- **Prioridade:** Alta - remover duplicação

#### `src/pages/ProjectsList.tsx`
- **Justificativa:** Funcionalidade movida para Dashboard (conforme IGNORED_FILES.md)
- **Substituir por:** `src/pages/Dashboard.tsx` + componentes específicos
- **Status de Import:** ⚠️ **VERIFICAR** - Migração completa
- **Risco de Arquivamento:** 🟢 Baixo (funcionalidade migrada)
- **Prioridade:** Alta - consolidar no Dashboard

### 🧩 **Componentes Duplicados/Não Utilizados**

#### `src/components/ui/glowing-effect-card.tsx`
- **Justificativa:** Duplicata exata de glowing-effect.tsx (conforme IGNORED_FILES.md)
- **Substituir por:** `src/components/ui/glowing-effect.tsx`
- **Status de Import:** 🔍 **ANALISAR** - Verificar imports específicos
- **Risco de Arquivamento:** 🟢 Baixo (é duplicata exata)
- **Prioridade:** Média - unificar implementação

#### `src/components/ui/typewriter.tsx`
- **Justificativa:** Não utilizado no projeto (conforme IGNORED_FILES.md)
- **Substituir por:** Implementação customizada se necessário
- **Status de Import:** 🔍 **ANALISAR** - Confirmar zero imports
- **Risco de Arquivamento:** 🟡 Médio (pode ter dependências ocultas)
- **Prioridade:** Baixa - verificar uso real

#### `src/components/ui/footer-section.tsx`
- **Justificativa:** Footer não implementado na aplicação (conforme IGNORED_FILES.md)
- **Substituir por:** Criar novo footer quando necessário
- **Status de Import:** 🔍 **ANALISAR** - Confirmar não integração
- **Risco de Arquivamento:** 🟡 Médio (pode estar incompleto)
- **Prioridade:** Baixa - avaliar necessidade futura

### 🪝 **Hooks Removidos/Legacy**

#### `src/hooks/useProjectSync.ts`
- **Justificativa:** Removido após cleanup - causava problemas (conforme IGNORED_FILES.md)
- **Substituir por:** `useUnifiedProjectStore` + React Query
- **Status de Import:** 🚨 **CRÍTICO** - Se importado, pode quebrar sistema
- **Risco de Arquivamento:** 🔴 Alto (foi removido por problemas)
- **Prioridade:** Crítica - verificar imports residuais

#### `src/hooks/useGeolocationCapture.tsx`
- **Justificativa:** Removido após cleanup - over-engineered (conforme IGNORED_FILES.md)
- **Substituir por:** Geolocation nativa do browser
- **Status de Import:** 🚨 **CRÍTICO** - Verificar se ainda referenciado
- **Risco de Arquivamento:** 🔴 Alto (foi removido)
- **Prioridade:** Crítica - migrar para solução nativa

#### `src/hooks/useProjectSyncManager.tsx`
- **Justificativa:** Sistema complexo removido (conforme IGNORED_FILES.md)
- **Substituir por:** Padrões simples de sincronização
- **Status de Import:** 🚨 **CRÍTICO** - Sistema complexo substituído
- **Risco de Arquivamento:** 🔴 Alto (complexidade removida)
- **Prioridade:** Crítica - verificar padrões atuais

### 📁 **Diretórios Template/Não Utilizados**

#### `src/app/` (Estrutura completa)
- **Justificativa:** Estrutura Next.js não utilizada (projeto é Vite) (conforme IGNORED_FILES.md)
- **Substituir por:** Estrutura atual `src/pages/`
- **Status de Import:** 🔍 **ANALISAR** - Verificar routing residual
- **Risco de Arquivamento:** 🟡 Médio (estrutura template)
- **Prioridade:** Média - limpar estrutura não utilizada

#### `src/app/admin/crm/page.tsx`
- **Justificativa:** Não integrado ao roteamento atual (conforme IGNORED_FILES.md)
- **Substituir por:** `src/pages/AdminPanel.tsx` + componentes
- **Status de Import:** 🔍 **ANALISAR** - Verificar integração
- **Risco de Arquivamento:** 🟡 Médio (não integrado)
- **Prioridade:** Baixa - avaliar necessidade

#### `src/app/crm/page.tsx`
- **Justificativa:** Duplicata de `src/pages/CRMPage.tsx` (conforme IGNORED_FILES.md)
- **Substituir por:** `src/pages/CRMPage.tsx`
- **Status de Import:** ⚠️ **VERIFICAR** - Duplicação de funcionalidade
- **Risco de Arquivamento:** 🟢 Baixo (é duplicata)
- **Prioridade:** Alta - usar versão em pages/

### 🗃️ **Stores/Contextos Legacy**

#### `src/stores/projectStore.ts`
- **Justificativa:** Substituído por unifiedProjectStore (conforme IGNORED_FILES.md)
- **Substituir por:** `src/stores/unifiedProjectStore.ts`
- **Status de Import:** 🚨 **CRÍTICO** - Store legacy pode causar conflitos
- **Risco de Arquivamento:** 🔴 Alto (store substituído)
- **Prioridade:** Crítica - migração completa necessária

---

## 🟡 CANDIDATOS SUSPEITOS (Média Prioridade)

### 🧩 **Componentes de Baixo Uso**

#### `src/components/ui/menubar.tsx`
- **Justificativa:** Não visto em uso, pode ser futuro (conforme IGNORED_FILES.md)
- **Status de Import:** 🔍 **ANALISAR** - Confirmar necessidade
- **Risco de Arquivamento:** 🟡 Médio (uso futuro incerto)
- **Prioridade:** Baixa - verificar planos de uso

#### `src/components/ui/navigation-menu.tsx`
- **Justificativa:** Navegação não implementada (conforme IGNORED_FILES.md)
- **Status de Import:** 🔍 **ANALISAR** - Implementação incompleta
- **Risco de Arquivamento:** 🟡 Médio (implementação pendente)
- **Prioridade:** Baixa - planejar uso adequado

#### `src/components/ui/pagination.tsx`
- **Justificativa:** Não visto em listas atuais (conforme IGNORED_FILES.md)
- **Status de Import:** 🔍 **ANALISAR** - Verificar integração
- **Risco de Arquivamento:** 🟡 Médio (não integrado)
- **Prioridade:** Baixa - implementar quando necessário

#### `src/components/ui/breadcrumb.tsx`
- **Justificativa:** Breadcrumbs não implementados (conforme IGNORED_FILES.md)
- **Status de Import:** 🔍 **ANALISAR** - Navegação não consistente
- **Risco de Arquivamento:** 🟡 Médio (navegação incompleta)
- **Prioridade:** Baixa - planejar navegação

### 📊 **Utilitários Especializados**

#### `src/components/ui/chart.tsx`
- **Justificativa:** Charts não vistos em uso atual (conforme IGNORED_FILES.md)
- **Status de Import:** 🔍 **ANALISAR** - Validar integração
- **Risco de Arquivamento:** 🟡 Médio (pode precisar configuração)
- **Prioridade:** Baixa - validar com dados reais

#### `src/lib/constants.ts`
- **Justificativa:** Baixo uso detectado (conforme IGNORED_FILES.md)
- **Status de Import:** 🔍 **ANALISAR** - Verificar valores atuais
- **Risco de Arquivamento:** 🟡 Médio (uso baixo)
- **Prioridade:** Baixa - validar conteúdo

#### `src/lib/validations.ts`
- **Justificativa:** Possível duplicação com schemas Zod (conforme IGNORED_FILES.md)
- **Status de Import:** 🔍 **ANALISAR** - Consolidar validações
- **Risco de Arquivamento:** 🟡 Médio (duplicação possível)
- **Prioridade:** Baixa - revisar estrutura

---

## 🟢 ARQUIVOS EM TRANSIÇÃO (Baixa Prioridade)

### ⚠️ **Componentes Parcialmente Migrados**

#### `src/contexts/ProjectContext.tsx`
- **Justificativa:** Funcionalidade parcialmente migrada para stores (conforme IGNORED_FILES.md)
- **Status de Import:** ⚠️ **USAR COM CUIDADO** - Em transição
- **Risco de Arquivamento:** 🟢 Baixo (ainda em uso controlado)
- **Prioridade:** Baixa - migração gradual

---

## 📊 Estatísticas de Candidatos

### 🔢 **Resumo Quantitativo**
```
Candidatos Confirmados (Alta Prioridade): 12 arquivos
├── Páginas Legacy: 3 arquivos
├── Componentes Duplicados: 3 arquivos  
├── Hooks Removidos: 3 arquivos
├── Diretórios Template: 3 arquivos
└── Stores Legacy: 1 arquivo

Candidatos Suspeitos (Média Prioridade): 8 arquivos
├── Componentes Baixo Uso: 4 arquivos
├── Utilitários Especializados: 3 arquivos
└── Charts/Navegação: 1 arquivo

Arquivos em Transição (Baixa Prioridade): 1 arquivo
└── Contextos Parciais: 1 arquivo

TOTAL: 21 candidatos identificados
```

### 🎯 **Distribuição por Risco de Arquivamento**
```
🔴 Alto Risco (Crítico verificar): 4 arquivos (19%)
├── Hooks removidos por problemas
└── Store legacy substituído

🟡 Médio Risco (Analisar primeiro): 12 arquivos (57%)
├── Templates não utilizados
├── Componentes não integrados
└── Possíveis duplicatas

🟢 Baixo Risco (Seguro arquivar): 5 arquivos (24%)
├── Duplicatas confirmadas  
├── Páginas substituídas
└── Em transição controlada
```

### 📈 **Status de Verificação Necessária**
```
🚨 CRÍTICO - Verificar imports imediatamente: 4 arquivos
⚠️ VERIFICAR - Analisar referências: 5 arquivos  
🔍 ANALISAR - Confirmar uso/integração: 12 arquivos

Prioridade de Verificação:
1. Hooks removidos (podem quebrar sistema)
2. Store legacy (conflitos de estado)
3. Páginas duplicadas (routing confuso)
4. Componentes não integrados (features incompletas)
```

---

## 🎯 Recomendações por Categoria

### 🚨 **Ação Imediata (Hooks/Stores Legacy)**
1. **Verificar imports críticos** dos hooks removidos
2. **Migrar referencias** do projectStore legacy
3. **Validar funcionamento** após limpeza
4. **Documentar migração** para evitar reintrodução

### 📋 **Análise Necessária (Templates/Duplicatas)**
1. **Confirmar routing** não usa estrutura app/
2. **Verificar duplicatas** de páginas/componentes
3. **Validar integração** de componentes suspeitos
4. **Planejar uso futuro** de componentes não implementados

### 🔄 **Monitoramento (Transição)**
1. **Acompanhar migração** do ProjectContext
2. **Validar uso controlado** de arquivos em transição
3. **Planejar próximos passos** de consolidação

---

## 📝 Próximos Passos

### 1️⃣ **Verificação de Imports (Imediato)**
```bash
# Executar verificador de imports
npm run check:imports-archive-candidates

# Gerar relatório detalhado
npm run check:imports-report
```

### 2️⃣ **Análise Detalhada (1-2 dias)**
- Confirmar status real de cada candidato
- Validar substituições funcionais
- Testar remoção controlada

### 3️⃣ **Soft Archive (Gradual)**
- Mover candidatos confirmados para `/archive`
- Manter links de substituição
- Documentar processo de restauração

### 4️⃣ **Limpeza Final (Futuro)**
- Remover arquivos não referenciados
- Consolidar documentação
- Atualizar guias de desenvolvimento