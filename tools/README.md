# Import Checker - Verificador de Referências

## 🎯 Objetivo

Ferramenta para verificar se arquivos candidatos ao arquivamento ainda são referenciados no código, ajudando a decidir com segurança se podem ser movidos para `/archive`.

## 📋 Como Usar

### 🔍 **Verificação Completa (Recomendado)**
```bash
# Executar verificação de todos os candidatos
npx ts-node tools/check-imports.ts

# Ou via package.json script (se configurado):
npm run check:imports
```

**Saída esperada:**
```
🔍 Iniciando verificação de imports para candidatos ao arquivamento...

📁 Analisando 180 arquivos...

📊 === IMPORT CHECK REPORT ===
📁 Total de candidatos analisados: 20
✅ Seguros para arquivar: 8
⚠️ Requerem análise: 7
🚫 Bloqueados por referências: 5

📋 Por categoria:
  legacy-pages: 2/3 seguros para arquivar
  duplicate-components: 2/3 seguros para arquivar
  removed-hooks: 0/3 seguros para arquivar
  template-files: 3/3 seguros para arquivar
  legacy-stores: 0/1 seguros para arquivar

🚨 CASOS CRÍTICOS:
  src/hooks/useProjectSync.ts: 3 referências críticas
  src/stores/projectStore.ts: 7 referências críticas

📄 Relatório detalhado salvo em: docs/refactor/import-check-report-2025-08-25.json
```

### 📊 **Analisar Relatório JSON**
```bash
# Ver relatório completo
cat docs/refactor/import-check-report-2025-08-25.json

# Filtrar apenas casos seguros para arquivar
jq '.detailedFindings[] | select(.safeToArchive == true)' docs/refactor/import-check-report-2025-08-25.json

# Ver apenas casos críticos
jq '.detailedFindings[] | select(.riskLevel == "critical")' docs/refactor/import-check-report-2025-08-25.json

# Contar referências por arquivo
jq '.detailedFindings | map({path: .candidatePath, refs: .totalReferences}) | sort_by(.refs)' docs/refactor/import-check-report-2025-08-25.json
```

---

## 📊 Interpretação dos Resultados

### ✅ **Seguros para Arquivar (safeToArchive: true)**
- **Zero referências** no código atual
- **Risco baixo** de quebrar funcionalidade
- **Podem ser movidos** para `/archive` imediatamente

**Exemplo:**
```json
{
  "candidatePath": "src/components/ui/typewriter.tsx",
  "category": "unused-components",
  "totalReferences": 0,
  "safeToArchive": true,
  "riskLevel": "low"
}
```

### ⚠️ **Requerem Análise (safeToArchive: false, mas poucas refs)**
- **Algumas referências** encontradas
- **Análise manual necessária** para confirmar impacto
- **Podem ser arquivados** após migração

**Exemplo:**
```json
{
  "candidatePath": "src/pages/Projects.tsx",
  "category": "legacy-pages",
  "totalReferences": 2,
  "safeToArchive": false,
  "riskLevel": "medium",
  "alternativePath": "src/pages/Dashboard.tsx"
}
```

### 🚫 **Bloqueados por Referências (riskLevel: critical/high)**
- **Múltiplas referências** ativas
- **Risco alto** de quebrar sistema
- **Não arquivar** sem migração completa

**Exemplo:**
```json
{
  "candidatePath": "src/hooks/useProjectSync.ts",
  "category": "removed-hooks",
  "totalReferences": 5,
  "safeToArchive": false,
  "riskLevel": "critical",
  "references": [
    {
      "importingFile": "src/pages/Dashboard.tsx",
      "importLine": 15,
      "riskLevel": "critical",
      "reasoning": "Hook foi removido por causar problemas - import pode quebrar funcionalidade"
    }
  ]
}
```

---

## 🔧 Estrutura do Relatório JSON

```typescript
interface CheckReport {
  summary: {
    totalCandidates: number;        // Total de candidatos verificados
    safeToArchive: number;          // Seguros para arquivar
    requiresAnalysis: number;       // Precisam de análise
    blockedByReferences: number;    // Bloqueados por refs
  };
  candidatesByCategory: {           // Agrupados por categoria
    "legacy-pages": ArchiveCandidateStatus[];
    "removed-hooks": ArchiveCandidateStatus[];
    // ... outras categorias
  };
  detailedFindings: ArchiveCandidateStatus[]; // Lista completa
}

interface ArchiveCandidateStatus {
  candidatePath: string;            // Arquivo candidato
  category: string;                 // Categoria (legacy, duplicate, etc)
  totalReferences: number;          // Total de imports encontrados
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  safeToArchive: boolean;           // Seguro para mover
  references: ImportReference[];    // Detalhes de cada import
  alternativePath?: string;         // Substituto recomendado
}
```

---

## 🎯 Casos de Uso

### 🚀 **Limpeza Rápida (Seguros)**
```bash
# 1. Executar verificação
npx ts-node tools/check-imports.ts

# 2. Filtrar seguros
jq '.detailedFindings[] | select(.safeToArchive == true) | .candidatePath' docs/refactor/import-check-report-2025-08-25.json

# 3. Mover arquivos seguros (manual)
mkdir -p archive/unused-components
mv src/components/ui/typewriter.tsx archive/unused-components/
```

### 🔍 **Análise Detalhada (Bloqueados)**
```bash
# Ver detalhes de arquivo específico
jq '.detailedFindings[] | select(.candidatePath == "src/hooks/useProjectSync.ts")' docs/refactor/import-check-report-2025-08-25.json

# Ver todos os arquivos que importam o candidato
jq '.detailedFindings[] | select(.candidatePath == "src/hooks/useProjectSync.ts") | .references[].importingFile' docs/refactor/import-check-report-2025-08-25.json

# Listar alternativas para migração
jq '.detailedFindings[] | select(.safeToArchive == false) | {path: .candidatePath, alternative: .alternativePath}' docs/refactor/import-check-report-2025-08-25.json
```

### 📊 **Monitoramento Contínuo**
```bash
# Executar verificação semanalmente
# (adicionar ao CI/CD como job não-bloqueante)

# Comparar relatórios ao longo do tempo
diff docs/refactor/import-check-report-2025-08-20.json docs/refactor/import-check-report-2025-08-25.json

# Acompanhar progresso de limpeza
jq '.summary | {safe: .safeToArchive, total: .totalCandidates, progress: (.safeToArchive / .totalCandidates * 100)}' docs/refactor/import-check-report-2025-08-25.json
```

---

## ⚠️ Limitações

### 🚫 **O que NÃO detecta**
- **Imports dinâmicos** (`import()`, `require()`)
- **Referências em strings** (paths em configs)
- **Comentários** com paths de arquivos
- **HTML/CSS** que podem referenciar arquivos

### 🔍 **Verificações Manuais Necessárias**
- **Configurações de build** (Vite, Webpack)
- **Routing dinâmico** (React Router)
- **Referencias em testes** não TypeScript
- **Assets** (imagens, styles) linkados

---

## 📋 Próximos Passos

### 1️⃣ **Executar Verificação**
```bash
npx ts-node tools/check-imports.ts
```

### 2️⃣ **Analisar Resultados**
- **Arquivar seguros** imediatamente
- **Migrar bloqueados** usando alternativas
- **Investigar suspeitos** manualmente

### 3️⃣ **Implementar Limpeza**
- **Criar estrutura** `/archive` se não existir
- **Mover arquivos seguros** primeiro
- **Documentar** processo de migração

### 4️⃣ **Monitorar Progresso**
- **Executar semanalmente** para acompanhar
- **Celebrar melhorias** na limpeza
- **Atualizar candidatos** conforme necessário

---

## 🛡️ Garantias de Segurança

### ✅ **Non-Invasive**
- **Apenas leitura** - não altera arquivos
- **Análise segura** de AST TypeScript
- **Não quebra builds** existentes

### ✅ **Verificação Dupla**
- **Multiple patterns** para detectar imports
- **Categorização de risco** conservadora
- **Alternativas** sempre sugeridas

### ✅ **Rollback Friendly**
- **Arquivos preservados** em `/archive`
- **Path documentation** mantida
- **Restauração simples** se necessário

---

## 🤝 Contribuição

Para adicionar novos candidatos ou melhorar detecção:

1. **Editar `tools/check-imports.ts`**
2. **Adicionar patterns** no array `archiveCandidates`
3. **Testar** com `npx ts-node tools/check-imports.ts`
4. **Validar** resultados no JSON gerado

**Exemplo de novo candidato:**
```typescript
{
  path: 'src/components/NewCandidate.tsx',
  category: 'new-category',
  alternative: 'src/components/NewAlternative.tsx'
}
```