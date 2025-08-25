# Política de Arquivamento - Archive Policy

## 🎯 Objetivo

Esta política define procedimentos seguros para arquivar arquivos legacy, duplicados ou não utilizados, garantindo que funcionalidades críticas não sejam afetadas.

---

## 📋 Princípios Fundamentais

### ✅ **Princípio Zero-Reference**
**Regra Absoluta:** Só mover arquivos para `/archive` quando **zero referências** ativas forem detectadas.

```bash
# ✅ SEGURO - Zero imports detectados
Candidato: src/components/ui/typewriter.tsx
Status: 0 referências ativas
Ação: PERMITIDO arquivar

# ❌ BLOQUEADO - Imports ativos encontrados  
Candidato: src/hooks/useProjectSync.ts
Status: 3 referências ativas
Ação: MIGRAÇÃO necessária antes do arquivamento
```

### 🔍 **Verificação Obrigatória**
**Antes de qualquer arquivamento:**

1. **Executar import checker** 
   ```bash
   npx ts-node tools/check-imports.ts
   ```

2. **Confirmar zero referências**
   ```json
   {
     "candidatePath": "arquivo/candidato.tsx",
     "totalReferences": 0,
     "safeToArchive": true
   }
   ```

3. **Validar build funcional**
   ```bash
   npm run build    # Deve passar
   npm run test     # Testes críticos OK
   npm run lint     # Zero errors introduzidos
   ```

### 🛡️ **Backup Obrigatório**
**Nunca arquivar sem backup:**

```bash
# Backup automático antes do arquivamento
git stash push -m "Pre-archive backup $(date)"

# Commit de documentação
git add docs/refactor/archive-log-$(date +%Y%m%d).md
git commit -m "docs: archive candidates analysis"
```

---

## 🗂️ Estrutura de Arquivamento

### 📁 **Organização do Diretório `/archive`**

```
archive/
├── README.md                    # Índice de arquivos arquivados
├── legacy-pages/               # Páginas substituídas
│   ├── Projects.tsx           
│   ├── ProjectsPage.tsx       
│   └── restoration-guide.md   # Como restaurar se necessário
├── duplicate-components/       # Componentes duplicados
│   ├── glowing-effect-card.tsx
│   └── alternative-mapping.md  # Mapeamento para versões ativas
├── removed-hooks/             # Hooks removidos por problemas
│   ├── useProjectSync.ts
│   ├── removal-reasons.md     # Por que foram removidos
│   └── migration-guide.md     # Como migrar código dependente
├── template-files/            # Arquivos template não utilizados
│   └── app-structure/         # Estrutura Next.js não utilizada
├── unused-components/         # Componentes não integrados
│   ├── typewriter.tsx
│   ├── footer-section.tsx
│   └── future-use-notes.md    # Notas para uso futuro
└── by-date/                   # Logs por data de arquivamento
    ├── 2025-08-25.md          # Arquivos movidos nesta data
    └── 2025-08-26.md
```

### 📄 **Documentação Obrigatória**

#### `archive/README.md`
```markdown
# Arquivo Principal do Archive
- Índice de todos os arquivos arquivados
- Data de arquivamento
- Razão do arquivamento  
- Substituto recomendado
- Procedimento de restauração
```

#### `archive/[categoria]/restoration-guide.md`
```markdown
# Guia de Restauração por Categoria
- Como restaurar arquivos desta categoria
- Dependências que podem ter mudado
- Validações necessárias pós-restauração
- Contato para suporte em caso de dúvidas
```

---

## 🚀 Procedimento de Arquivamento

### 📋 **Passo-a-Passo Detalhado**

#### 1️⃣ **Análise Prévia**
```bash
# Executar verificação de imports
npx ts-node tools/check-imports.ts

# Analisar relatório gerado
cat docs/refactor/import-check-report-$(date +%Y-%m-%d).json

# Filtrar apenas seguros
jq '.detailedFindings[] | select(.safeToArchive == true)' docs/refactor/import-check-report-$(date +%Y-%m-%d).json
```

#### 2️⃣ **Backup de Segurança**
```bash
# Backup Git
git stash push -m "Archive backup - $(date)"

# Backup físico dos arquivos
mkdir -p backup/pre-archive-$(date +%Y%m%d)
cp -r src/ backup/pre-archive-$(date +%Y%m%d)/
```

#### 3️⃣ **Criação da Estrutura Archive**
```bash
# Criar diretório se não existir
mkdir -p archive/{legacy-pages,duplicate-components,removed-hooks,template-files,unused-components,by-date}

# Criar documentação base
touch archive/README.md
touch archive/by-date/$(date +%Y-%m-%d).md
```

#### 4️⃣ **Movimentação dos Arquivos**
```bash
# Para cada arquivo SEGURO:
# 1. Identificar categoria
CATEGORY="unused-components"
FILE="src/components/ui/typewriter.tsx"

# 2. Mover para archive com estrutura preservada
mkdir -p archive/$CATEGORY/$(dirname $FILE | sed 's|src/||')
mv $FILE archive/$CATEGORY/$(echo $FILE | sed 's|src/||')

# 3. Documentar movimento
echo "- $FILE → archive/$CATEGORY/ ($(date))" >> archive/by-date/$(date +%Y-%m-%d).md
```

#### 5️⃣ **Atualização de Documentação**
```bash
# Atualizar README principal
echo "## Arquivamento $(date +%Y-%m-%d)" >> archive/README.md
echo "Arquivos movidos: X" >> archive/README.md
echo "Categoria principal: $CATEGORY" >> archive/README.md

# Atualizar guias de restauração
echo "### $FILE" >> archive/$CATEGORY/restoration-guide.md
echo "Arquivado em: $(date)" >> archive/$CATEGORY/restoration-guide.md
echo "Substituto: [alternativo identificado]" >> archive/$CATEGORY/restoration-guide.md
```

#### 6️⃣ **Validação Pós-Arquivamento**
```bash
# Validar build
npm run build

# Executar testes críticos  
npm run test

# Verificar lint
npm run lint

# Confirmar zero imports residuais
npx ts-node tools/check-imports.ts
```

#### 7️⃣ **Commit das Mudanças**
```bash
# Add arquivos movidos
git add archive/

# Add atualizações de documentação
git add docs/refactor/

# Commit estruturado
git commit -m "archive: move unused files to archive/

- Moved X files to archive/$CATEGORY/
- Zero active references confirmed  
- Build validation passed
- Documentation updated

Files archived:
- $FILE
"
```

---

## 🔄 Procedimento de Restauração

### 📋 **Quando Restaurar**

1. **Funcionalidade perdida** após arquivamento
2. **Dependência descoberta** não mapeada
3. **Requisito futuro** para arquivo arquivado
4. **Error crítico** relacionado ao arquivo

### 🚀 **Passos de Restauração**

#### 1️⃣ **Identificar Arquivo**
```bash
# Localizar no archive
find archive/ -name "arquivo-necessario.tsx"

# Verificar documentação
cat archive/[categoria]/restoration-guide.md
```

#### 2️⃣ **Verificar Compatibilidade**
```bash
# Verificar se dependências mudaram
git log --since="data-arquivamento" --grep="dependencies"

# Verificar mudanças estruturais
git diff HEAD~30 HEAD -- src/[estrutura-relacionada]/
```

#### 3️⃣ **Restauração Controlada**
```bash
# Backup atual antes de restaurar
git stash push -m "Pre-restoration backup $(date)"

# Mover arquivo de volta
mv archive/[categoria]/path/arquivo.tsx src/path/arquivo.tsx

# Verificar imports necessários
npx ts-node tools/check-imports.ts --target="src/path/arquivo.tsx"
```

#### 4️⃣ **Validação de Restauração**
```bash
# Build deve passar
npm run build

# Testes devem passar
npm run test  

# Funcionalidade deve estar operacional
npm run dev # Teste manual
```

#### 5️⃣ **Documentação da Restauração**
```bash
# Log de restauração
echo "RESTORED: $arquivo em $(date)" >> archive/restoration-log.md
echo "Razão: $razao-restauracao" >> archive/restoration-log.md

# Atualizar arquivo index
sed -i "/arquivo-restaurado/d" archive/README.md

# Commit da restauração
git add .
git commit -m "restore: bring back $arquivo from archive

Reason: $razao-restauracao
Validation: build and tests passing
"
```

---

## 📊 Critérios de Categorização

### 🔴 **NUNCA Arquivar (Bloqueadores)**

```
❌ Arquivos com referências ativas (totalReferences > 0)
❌ Core business logic não substituído  
❌ Hooks/stores em uso produção
❌ Componentes UI ativamente utilizados
❌ Types/interfaces referenciados
❌ Arquivos de configuração crítica
```

### 🟡 **Analisar Antes de Arquivar**

```
⚠️ Componentes suspeitos de baixo uso
⚠️ Utilitários especializados
⚠️ Templates potencialmente úteis
⚠️ Arquivos em transição
⚠️ Código experimental
```

### 🟢 **Seguros para Arquivar**

```
✅ Zero referências confirmadas
✅ Substitutos validados funcionando
✅ Duplicatas exatas removíveis
✅ Templates não integrados
✅ Código legacy comprovadamente obsoleto
```

---

## 📈 Métricas e Monitoramento

### 📊 **KPIs de Arquivamento**

```bash
# Arquivos arquivados por mês
ls archive/by-date/ | wc -l

# Taxa de restauração (objetivo: <5%)
echo "scale=2; $(cat archive/restoration-log.md | wc -l) / $(find archive/ -name "*.tsx" -o -name "*.ts" | wc -l) * 100" | bc

# Redução de código base
BEFORE=$(git log --grep="archive:" --reverse | head -1 | cut -d' ' -f2)
AFTER=$(git rev-parse HEAD)
git diff $BEFORE $AFTER --stat | tail -1
```

### 🔍 **Relatórios Mensais**

```bash
# Gerar relatório mensal
echo "## Relatório de Arquivamento - $(date +%Y-%m)" > reports/archive-$(date +%Y-%m).md
echo "Arquivos movidos: $(ls archive/by-date/$(date +%Y-%m)-*.md 2>/dev/null | wc -l)" >> reports/archive-$(date +%Y-%m).md
echo "Restaurações: $(grep "$(date +%Y-%m)" archive/restoration-log.md 2>/dev/null | wc -l)" >> reports/archive-$(date +%Y-%m).md
echo "Build health: $(npm run build >/dev/null 2>&1 && echo "✅ Passing" || echo "❌ Failing")" >> reports/archive-$(date +%Y-%m).md
```

---

## 🛡️ Política de Segurança

### 🚨 **Triggers de Rollback**

```
1. Build quebrado após arquivamento → Rollback imediato
2. Testes críticos falhando → Investigação + possível rollback
3. Funcionalidade perdida → Restauração específica
4. Performance degraded → Análise + ação corretiva
```

### 📋 **Checklist de Segurança**

```bash
# Antes do arquivamento
[ ] Import checker executado
[ ] Zero referências confirmadas  
[ ] Build passing
[ ] Testes críticos OK
[ ] Backup realizado
[ ] Documentação atualizada

# Após o arquivamento
[ ] Build ainda passing
[ ] Testes ainda OK
[ ] Funcionalidade preservada
[ ] Performance mantida
[ ] Documentação commitada
```

---

## 🎯 Objetivos e Benefícios

### 📈 **Objetivos Quantitativos**
- **Reduzir código base** em 15-20% através de arquivamento seguro
- **Manter taxa de restauração** abaixo de 5%
- **Zero quebras** de funcionalidade por arquivamento incorreto
- **Documentação 100% completa** de arquivos movidos

### ✅ **Benefícios Esperados**
- **Codebase mais limpo** e fácil de navegar
- **Build times reduzidos** com menos arquivos para processar
- **Onboarding mais rápido** para novos desenvolvedores  
- **Manutenção simplificada** com menos código para manter
- **Arquitetura mais clara** sem código legacy confuso

---

## 📞 Suporte e Escalação

### 🆘 **Em Caso de Problemas**

1. **Restauração emergencial:**
   ```bash
   git stash pop  # Restore backup
   ```

2. **Investigação de build quebrado:**
   ```bash
   git bisect start
   git bisect bad HEAD
   git bisect good [commit-antes-archive]
   ```

3. **Contato para suporte:**
   - Revisar logs em `archive/restoration-log.md`
   - Consultar `archive/[categoria]/restoration-guide.md`
   - Abrir issue com detalhes do problema

### 📚 **Documentação Adicional**
- `docs/refactor/MOVE_PLAN.md` - Plano geral de refatoração
- `docs/refactor/FACADES_REPORT_*.md` - Relatórios de facades
- `tools/README.md` - Guia das ferramentas de verificação