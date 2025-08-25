# Codemods Plan - Transformação Segura de Imports

## 🎯 Objetivo

Transformar imports antigos para usar facades e barrels de forma **segura, progressiva e reversível**, usando AST manipulation com ts-morph/jscodeshift.

## 📋 Estratégia Geral

### 🔄 **Abordagem Progressiva**
1. **Preview-first** - Sempre mostrar o que será alterado antes
2. **Domínio por domínio** - Nunca aplicar tudo de uma vez
3. **Rollback preparado** - Manter histórico e reverter se necessário
4. **Validação automática** - Build + testes após cada transformação

### 🛡️ **Princípios de Segurança**
- ✅ **Dry-run obrigatório** antes de qualquer mudança
- ✅ **Backup automático** dos arquivos alterados
- ✅ **Validação sintática** pós-transformação
- ✅ **Rollback em 1 comando** se algo quebrar
- ✅ **Logs detalhados** de todas as mudanças

---

## 🎨 Escopo Progressivo - Fase por Fase

### 📊 **Fase 1: UI Components (Baixo Risco)**
**Alvo:** `@/components/ui/*` → `@/components/ui` (barrel)

```typescript
// Transformação
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// ↓ Vira:
import { Button, Card, CardContent } from '@/components/ui';
```

**Critérios de segurança:**
- ✅ Componentes shadcn/ui são estáveis
- ✅ Barrel já existe e foi testado
- ✅ Transformação é conservativa
- ✅ Reversão é simples

**Arquivos alvo:** ~50-80 arquivos
**Risco:** 🟢 Baixo

### 📚 **Fase 2: Libs e Utils (Médio Risco)**
**Alvo:** `@/lib/utils` → `@/lib`, `@/hooks/use-toast` → `@/hooks`

```typescript
// Transformação
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
// ↓ Vira:
import { cn } from '@/lib';
import { useToast } from '@/hooks';
```

**Critérios de segurança:**
- ✅ Utils são funções puras (menor risco)
- ✅ Hooks são bem testados
- ⚠️ Verificar re-exports corretos

**Arquivos alvo:** ~30-50 arquivos
**Risco:** 🟡 Médio

### 🤖 **Fase 3: Agents e Integrations (Alto Risco)**
**Alvo:** `@/utils/agents/*` → `@/facades/agents`, `@/integrations/*` → `@/facades/integrations`

```typescript
// Transformação
import { sendMessageToAgent } from '@/utils/agents/unifiedAgentService';
import { supabase } from '@/integrations/supabase/client';
// ↓ Vira:
import { sendMessageToAgent } from '@/facades/agents';
import { supabase } from '@/facades/integrations';
```

**Critérios de segurança:**
- ⚠️ APIs críticas do sistema
- ⚠️ Lógica de negócio sensível
- 🔴 Require testes extensivos pós-transformação

**Arquivos alvo:** ~20-30 arquivos
**Risco:** 🔴 Alto

### 📂 **Fase 4: Projects e Core (Crítico)**
**Alvo:** APIs de projeto para facades

```typescript
// Transformação (mais complexa)
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
import { useProjectNavigation } from '@/hooks/useProjectNavigation';
// ↓ Vira:
import { useUnifiedProjectStore } from '@/facades/projects';
import { useProjectNavigation } from '@/facades/core';
```

**Critérios de segurança:**
- 🔴 Core business logic
- 🔴 Estado crítico da aplicação
- 🔴 Requires manual review de cada arquivo

**Arquivos alvo:** ~15-25 arquivos
**Risco:** 🔴 Crítico

---

## 🛠️ Ferramentas e Tecnologias

### 📦 **ts-morph (Recomendado)**
```typescript
import { Project, SyntaxKind } from 'ts-morph';

// Vantagens:
// ✅ TypeScript nativo - entende tipos
// ✅ API simples e poderosa
// ✅ Preserva formatação e comentários
// ✅ Validação automática de sintaxe
```

### 📦 **jscodeshift (Alternativa)**
```typescript
import jscodeshift from 'jscodeshift';

// Vantagens:
// ✅ Ecosystem maduro
// ✅ Muitos codemods existentes
// ⚠️ Menos TypeScript-aware
```

### 📦 **Ferramentas de Backup**
```bash
# Git stash automático
git stash push -m "Pre-codemod backup $(date)"

# Backup de arquivos específicos
cp -r src/ backup/src-$(date +%Y%m%d-%H%M%S)/
```

---

## 🔍 Pipeline de Execução

### 1️⃣ **Preview Phase (Obrigatória)**
```bash
# Gerar relatório do que será alterado
npm run codemod:preview ui
npm run codemod:preview libs  
npm run codemod:preview agents
```

### 2️⃣ **Validation Phase (Automática)**
```bash
# Verificar se transformações são seguras
npm run codemod:validate ui
npm run codemod:validate libs
```

### 3️⃣ **Apply Phase (Controlada)**
```bash
# Aplicar transformações com backup automático
npm run codemod:apply ui --backup
npm run codemod:apply libs --backup
```

### 4️⃣ **Verification Phase (Crítica)**
```bash
# Verificar integridade pós-transformação
npm run build
npm run test
npm run lint
```

### 5️⃣ **Rollback Phase (Se necessário)**
```bash
# Reverter transformações
npm run codemod:rollback ui
npm run codemod:rollback libs
```

---

## 📊 Transformações Específicas

### 🎨 **UI Components → Barrel**
```typescript
// Detectar padrões:
const patterns = [
  /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/components\/ui\/([^'"]+)['"]/g,
  /import\s+(\w+)\s+from\s*['"]@\/components\/ui\/([^'"]+)['"]/g,
];

// Transformação:
// ANTES: import { Button } from '@/components/ui/button';
// DEPOIS: import { Button } from '@/components/ui';

// Lógica de agrupamento:
// Se múltiplos imports de @/components/ui/*, agrupar em um import
```

### 📚 **Utils → Barrel**
```typescript
// Detectar padrões:
const patterns = [
  /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/lib\/utils['"]/g,
  /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/hooks\/use-toast['"]/g,
];

// Transformação conservativa:
// Apenas se o barrel re-exporta a função específica
```

### 🤖 **Agents → Facade**
```typescript
// Padrões complexos:
const patterns = [
  /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/utils\/agents\/([^'"]+)['"]/g,
  /import\s+type\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/utils\/agents\/([^'"]+)['"]/g,
];

// Cuidados especiais:
// ✅ Verificar se facade re-exporta EXATAMENTE os mesmos tipos
// ✅ Manter imports de tipo separados se necessário
```

---

## 🔧 Critérios de Segurança Detalhados

### ✅ **Pré-condições (Obrigatórias)**
1. **Build limpo** antes de iniciar
2. **Testes passando** no estado atual
3. **Git working directory limpo**
4. **Facades/barrels validados** e funcionais

### ✅ **Validações Durante Transformação**
1. **Sintaxe TypeScript válida** após cada arquivo
2. **Imports resolvem corretamente** (verificação de módulos)
3. **Tipos mantidos** (no type errors introduzidos)
4. **Formatação preservada** (prettier/eslint compliant)

### ✅ **Validações Pós-Transformação**
1. **Build successful** com zero errors
2. **Testes passando** (smoke tests mínimo)
3. **Lint clean** (no new warnings)
4. **Runtime behavior** inalterado

### 🚨 **Triggers de Rollback Automático**
1. **Build quebrou** → Rollback imediato
2. **Testes falharam** → Rollback + análise
3. **Import errors** → Rollback + fix manual
4. **Type errors** → Rollback + investigação

---

## 📈 Métricas e Monitoramento

### 📊 **Métricas de Transformação**
```typescript
interface TransformationMetrics {
  filesProcessed: number;
  importsTransformed: number;
  errorsFound: number;
  rollbacksExecuted: number;
  timeSaved: string; // em imports mais limpos
}
```

### 📋 **Relatórios Gerados**
1. **transformation-report-YYYYMMDD.md** - O que foi alterado
2. **validation-report-YYYYMMDD.md** - Testes pós-transformação
3. **rollback-log-YYYYMMDD.md** - Histórico de reversões
4. **metrics-summary-YYYYMMDD.json** - Dados quantitativos

---

## 🚀 Benefícios Esperados

### ✅ **Imports Mais Limpos**
```typescript
// ANTES (6 linhas)
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// DEPOIS (3 linhas - 50% redução)
import { Button, Card, CardContent, Dialog, DialogContent } from '@/components/ui';
import { useToast } from '@/hooks';
import { cn } from '@/lib';
import { supabase } from '@/facades/integrations';
```

### ✅ **APIs Mais Estáveis**
- Preparação para futuras refatorações
- Pontos de entrada consistentes
- Melhor tree-shaking

### ✅ **Developer Experience**
- IntelliSense mais organizado
- Descoberta mais fácil de APIs
- Padrões consistentes