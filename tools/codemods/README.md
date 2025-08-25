# Codemods Tools - Transformação Segura de Imports

## 🎯 Objetivo

Ferramentas para transformar imports antigos para usar facades e barrels de forma **segura e controlada**.

## 📋 Scripts Disponíveis

### 🔍 **preview-facade-imports.ts**
**Função:** Analisa código e mostra quais imports seriam transformados (DRY-RUN)

**Características:**
- ✅ **Não altera nada** - apenas relatório
- ✅ **Análise por fases** (UI → Libs → Agents → Projects)
- ✅ **Níveis de confiança** (high, medium, low)
- ✅ **Relatório detalhado** em JSON

---

## 🚀 Como Usar

### 📋 **Pré-requisitos**
```bash
# Instalar dependências para codemods
npm install --save-dev ts-morph
```

### 🔍 **1. Preview Completo (Recomendado)**
```bash
# Executar preview de todas as fases
npx ts-node tools/codemods/preview-facade-imports.ts

# Ou via package.json script:
npm run codemod:preview
```

**Saída esperada:**
```
🔍 Iniciando preview de transformações...

📁 Analisando 180 arquivos...

🎨 === FASE 1: UI COMPONENTS → BARREL ===
✅ Encontradas 45 transformações UI

📚 === FASE 2: LIBS E UTILS → BARRELS ===
✅ Encontradas 23 transformações Libs/Utils

🤖 === FASE 3: AGENTS E INTEGRATIONS → FACADES ===
✅ Encontradas 18 transformações Agents/Integrations

📂 === FASE 4: PROJECTS → FACADES (CRÍTICA) ===
✅ Encontradas 12 transformações Projects (CRÍTICAS)

📊 === SUMMARY REPORT ===
📁 Total de arquivos analisados: 180
🔄 Total de transformações encontradas: 98

📋 Por fase:
  Fase 1: UI Components: 45 transformações
  Fase 2: Libs e Utils: 23 transformações
  Fase 3: Agents e Integrations: 18 transformações
  Fase 4: Projects (Crítica): 12 transformações

🎯 Por confiança:
  🟢 Alta (high): 68 - Seguras para aplicar
  🟡 Média (medium): 18 - Requer validação
  🔴 Baixa (low): 12 - Review manual obrigatório

📄 Relatório detalhado salvo em: docs/refactor/codemod-preview-2025-08-25.json
```

### 📊 **2. Analisar Relatório JSON**
```bash
# Ver relatório detalhado
cat docs/refactor/codemod-preview-2025-08-25.json

# Filtrar por confiança alta (candidatos seguros)
jq '.transformations[] | select(.confidence == "high")' docs/refactor/codemod-preview-2025-08-25.json

# Contar transformações por arquivo
jq '.transformations | group_by(.filePath) | map({file: .[0].filePath, count: length})' docs/refactor/codemod-preview-2025-08-25.json
```

### 🎯 **3. Preview por Fase Específica**
```bash
# Criar filtros customizados (futuro)
npm run codemod:preview -- --phase ui
npm run codemod:preview -- --phase libs
npm run codemod:preview -- --confidence high
```

---

## 📊 Interpretação dos Resultados

### 🟢 **Confiança Alta (high)**
- ✅ **Seguros para aplicar** automaticamente
- ✅ **Componentes shadcn/ui** bem estabelecidos
- ✅ **Barrels testados** e funcionais
- ✅ **Baixo risco** de quebra

**Exemplo:**
```typescript
// SEGURO - Componente UI estável
import { Button } from '@/components/ui/button';
// → import { Button } from '@/components/ui';
```

### 🟡 **Confiança Média (medium)**
- ⚠️ **Requer validação** antes de aplicar
- ⚠️ **Verificar re-exports** no barrel/facade
- ⚠️ **Testar funcionamento** pós-transformação

**Exemplo:**
```typescript
// MÉDIO - Verificar se facade re-exporta todas as funções
import { sendMessageToAgent, AgentType } from '@/utils/agents/unifiedAgentService';
// → import { sendMessageToAgent, AgentType } from '@/facades/agents';
```

### 🔴 **Confiança Baixa (low)**
- 🚨 **Review manual obrigatório**
- 🚨 **Core business logic**
- 🚨 **Testar extensivamente** após mudança
- 🚨 **Candidatos para última fase**

**Exemplo:**
```typescript
// CRÍTICO - Core do sistema de projetos
import { useUnifiedProjectStore } from '@/stores/unifiedProjectStore';
// → import { useUnifiedProjectStore } from '@/facades/projects';
```

---

## 🔧 Estrutura do Relatório JSON

```typescript
interface PreviewSummary {
  totalFiles: number;           // Total de arquivos analisados
  totalTransformations: number; // Total de transformações encontradas
  byPhase: {                   // Contadores por fase
    "Fase 1: UI Components": number;
    "Fase 2: Libs e Utils": number;
    "Fase 3: Agents e Integrations": number;
    "Fase 4: Projects (Crítica)": number;
  };
  byConfidence: {              // Contadores por confiança
    high: number;
    medium: number;
    low: number;
  };
  transformations: Array<{     // Lista detalhada
    filePath: string;          // Arquivo a ser alterado
    currentImport: string;     // Import atual
    newImport: string;         // Import proposto
    confidence: 'high' | 'medium' | 'low';
    reasoning: string;         // Explicação da transformação
  }>;
}
```

---

## 📋 Próximos Passos (Futuros Scripts)

### 🔄 **apply-facade-imports.ts** (NÃO CRIADO AINDA)
```bash
# Aplicar transformações por fase (com backup automático)
npm run codemod:apply ui --backup
npm run codemod:apply libs --backup --confidence high
```

### 🔙 **rollback-facade-imports.ts** (NÃO CRIADO AINDA)
```bash
# Reverter transformações se algo quebrar
npm run codemod:rollback ui
npm run codemod:rollback libs
```

### ✅ **validate-facade-imports.ts** (NÃO CRIADO AINDA)
```bash
# Validar que transformações são seguras
npm run codemod:validate ui
npm run codemod:validate -- --build --test
```

---

## 🛡️ Garantias de Segurança

### ✅ **Preview-First**
- **Sempre** ver o que será alterado antes
- **Relatórios detalhados** de todas as mudanças
- **Análise de risco** por transformação

### ✅ **Backup Automático**
- **Git stash** antes de qualquer mudança
- **Backup de arquivos** específicos
- **Reversão em 1 comando**

### ✅ **Validação Contínua**
- **Build check** após cada fase
- **Teste automático** de funcionalidade
- **Lint validation** de código resultante

---

## 🚧 Limitações Atuais

- ❌ **Apenas preview** - não aplica mudanças ainda
- ❌ **Patterns fixos** - não detecta todos os casos
- ❌ **Sem validação de re-exports** - assume que facades estão corretas
- ❌ **Sem grouping de imports** - cada import é tratado individualmente

---

## 🤝 Contribuição

Para adicionar novos patterns ou melhorar detecção:

1. **Editar `preview-facade-imports.ts`**
2. **Adicionar patterns** na fase apropriada
3. **Testar com `npm run codemod:preview`**
4. **Validar resultados** no relatório JSON

**Exemplo de novo pattern:**
```typescript
// Em previewPhase1_UI()
{ 
  pattern: /@\/components\/ui\/tabs/, 
  newImport: '@/components/ui', 
  exports: ['Tabs', 'TabsContent', 'TabsList', 'TabsTrigger'] 
}
```