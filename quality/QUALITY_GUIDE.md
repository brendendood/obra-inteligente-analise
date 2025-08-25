# 📋 GUIA DE QUALITY CHECK - MadenAI

> **Data:** 2025-08-25  
> **Modo:** Check-only - Apenas verificação, sem modificações automáticas  
> **Stack:** Node.js + TypeScript + React + Vite + Tailwind CSS

## 🎯 OVERVIEW

Este diretório contém ferramentas de quality check configuradas para **verificação apenas**. Nenhuma ferramenta está configurada para alterar código automaticamente, mantendo o princípio de segurança.

## 🛠️ FERRAMENTAS CONFIGURADAS

### 📏 **ESLint** (Já configurado)
- **Arquivo:** `eslint.config.js` (raiz do projeto)
- **Propósito:** Análise de código JavaScript/TypeScript
- **Modo:** Check-only

### 🎨 **Prettier** 
- **Arquivo:** `/quality/prettier.config.js`
- **Propósito:** Verificação de formatação de código
- **Modo:** Check-only (apenas `--check`)

### 📝 **TypeScript**
- **Arquivo:** `tsconfig.json` (raiz do projeto)
- **Propósito:** Verificação de tipos e compilação
- **Modo:** Check-only (`--noEmit`)

### 🎨 **Stylelint**
- **Arquivo:** `/quality/stylelint.config.js`
- **Propósito:** Verificação de estilos CSS/Tailwind
- **Modo:** Check-only

### 📦 **Dependency Cruiser**
- **Arquivo:** `/quality/dependency-cruiser.config.js`
- **Propósito:** Análise de dependências e arquitetura
- **Modo:** Report-only

### 📊 **Bundle Analyzer**
- **Arquivo:** `/quality/bundle-analyzer.config.js`
- **Propósito:** Análise de tamanho do bundle
- **Modo:** Report-only

### 💬 **Commitlint**
- **Arquivo:** `/quality/commitlint.config.js`
- **Propósito:** Verificação de mensagens de commit
- **Modo:** Verification-only

## 🚀 EXECUÇÃO LOCAL

### 📋 **Comandos Principais**

```bash
# 🔍 VERIFICAÇÃO COMPLETA (todos os checks)
npm run quality:check

# 📏 ESLint - Verificar código JavaScript/TypeScript
npm run quality:eslint

# 🎨 Prettier - Verificar formatação
npm run quality:prettier

# 📝 TypeScript - Verificar tipos
npm run quality:types

# 🎨 Stylelint - Verificar estilos
npm run quality:styles

# 📦 Dependency Cruiser - Analisar dependências
npm run quality:deps

# 📊 Bundle Analyzer - Analisar bundle
npm run quality:bundle

# 💬 Commitlint - Verificar último commit
npm run quality:commit
```

### 📊 **Scripts Adicionais**

```bash
# 📈 Relatório completo (todos os checks + relatórios)
npm run quality:report

# 🚨 Verificação de segurança
npm run quality:security

# 📏 Métricas de código
npm run quality:metrics

# 🧪 Smoke tests de quality
npm run quality:smoke
```

## 📊 INTERPRETAÇÃO DE RELATÓRIOS

### 📏 **ESLint Report**
```bash
# Saída típica:
✅ No issues found (0 errors, 0 warnings)
❌ Found 5 errors, 12 warnings

# Tipos de problemas:
- Error: Problemas que devem ser corrigidos
- Warning: Sugestões de melhoria
- Info: Informações adicionais
```

### 🎨 **Prettier Report**
```bash
# Saída típica:
✅ All files are formatted correctly
❌ Found 3 files that need formatting:
  - src/components/Header.tsx
  - src/utils/helpers.ts
  - src/pages/Dashboard.tsx
```

### 📝 **TypeScript Report**
```bash
# Saída típica:
✅ No type errors found
❌ Found 2 type errors:
  - src/types/user.ts(15,3): Type 'string' is not assignable to type 'number'
  - src/hooks/useAuth.ts(42,8): Property 'email' does not exist on type 'User'
```

### 🎨 **Stylelint Report**
```bash
# Saída típica:
✅ No style issues found
❌ Found 4 style issues:
  - src/index.css(23,5): Unexpected duplicate property "margin"
  - src/components/Card.module.css(45,12): Expected class selector to be kebab-case
```

### 📦 **Dependency Cruiser Report**
```bash
# Saída típica:
✅ No dependency violations found
❌ Found 3 dependency violations:
  - Circular dependency: src/utils/auth.ts → src/hooks/useAuth.ts → src/utils/auth.ts
  - Forbidden import: src/components/ui/Button.tsx should not import from src/pages/
  - Missing dependency: react-router-dom used but not in package.json
```

### 📊 **Bundle Analyzer Report**
```bash
# Saída típica:
Bundle Size Analysis:
├─ Initial bundle: 245.8 KB (gzipped: 78.2 KB) ✅
├─ Vendor chunks: 189.3 KB (gzipped: 65.4 KB) ✅
├─ App chunks: 56.5 KB (gzipped: 12.8 KB) ✅
└─ Largest chunks:
   1. react-dom.js: 45.2 KB
   2. vendor.js: 38.7 KB
   3. app.js: 23.1 KB

Warnings:
⚠️ Large chunk detected: vendor.js (>30KB)
⚠️ Potential duplicate: lodash found in 2 chunks
```

## 🎯 CRITÉRIOS DE QUALIDADE

### ✅ **Targets de Qualidade**

```bash
📏 ESLint:
- Errors: 0 ✅
- Warnings: < 10 ✅

🎨 Prettier:
- Unformatted files: 0 ✅

📝 TypeScript:
- Type errors: 0 ✅
- Strict mode: enabled ✅

🎨 Stylelint:
- Style errors: 0 ✅
- Warnings: < 5 ✅

📦 Dependencies:
- Circular dependencies: 0 ✅
- Violations: 0 ✅
- Outdated packages: < 5 ⚠️

📊 Bundle:
- Initial bundle: < 300KB ✅
- Gzipped: < 100KB ✅
- Chunks: < 50KB each ✅
```

### ⚠️ **Limites de Alerta**

```bash
🚨 Critical (Must Fix):
- ESLint errors > 0
- TypeScript errors > 0
- Circular dependencies > 0
- Security vulnerabilities (high/critical)

⚠️ Warning (Should Fix):
- ESLint warnings > 20
- Stylelint errors > 0
- Bundle size > 400KB
- Duplicate dependencies > 3

💡 Info (Consider Fixing):
- Outdated dependencies
- Large files > 100KB
- Complex functions (cognitive complexity > 15)
```

## 📈 RELATÓRIOS DETALHADOS

### 📋 **Quality Report Structure**
```
quality/reports/
├── eslint-report.json          # ESLint results
├── prettier-report.txt         # Prettier results
├── typescript-report.txt       # TypeScript results
├── stylelint-report.json       # Stylelint results
├── dependency-report.json      # Dependency analysis
├── bundle-report.html          # Bundle analysis
├── security-report.json        # Security audit
└── summary-report.md           # Consolidated summary
```

### 📊 **Metrics Dashboard**
```bash
# Gerar dashboard completo
npm run quality:dashboard

# Abre browser com:
# - Code coverage
# - Dependency graph
# - Bundle visualization
# - Quality trends
```

## 🔧 CONFIGURAÇÃO E CUSTOMIZAÇÃO

### ⚙️ **Personalizando Rules**

```bash
# ESLint rules:
# Editar: eslint.config.js (raiz)

# Prettier options:
# Editar: quality/prettier.config.js

# TypeScript strict mode:
# Editar: tsconfig.json (raiz)

# Stylelint rules:
# Editar: quality/stylelint.config.js
```

### 🎯 **Configurando Targets**
```bash
# Editar targets de qualidade:
# quality/quality-targets.json

# Configurar CI thresholds:
# .ci/QUALITY.yml
```

## 🚨 TROUBLESHOOTING

### ❌ **Problemas Comuns**

#### ESLint não encontra arquivos
```bash
# Verificar padrões de inclusão
npx eslint --print-config src/App.tsx

# Verificar se arquivos existem
find src -name "*.ts" -o -name "*.tsx" | head -10
```

#### Prettier conflita com ESLint
```bash
# Verificar integração
npm run quality:prettier:eslint-check

# Instalar plugin de integração (se necessário)
npm install --save-dev eslint-config-prettier
```

#### TypeScript errors em node_modules
```bash
# Verificar skipLibCheck
grep -n "skipLibCheck" tsconfig.json

# Limpar cache
rm -rf node_modules/.cache
npm run type-check
```

#### Bundle analyzer não gera relatório
```bash
# Verificar se build existe
npm run build

# Gerar bundle report manualmente
npx vite build --analyze
```

## 📅 EXECUÇÃO PERIÓDICA

### 🔄 **Rotina Recomendada**

```bash
# Diária (antes de commit):
npm run quality:check

# Semanal (análise completa):
npm run quality:report

# Mensal (auditoria completa):
npm run quality:audit
npm audit
npm outdated
```

### 📊 **Monitoramento Contínuo**
```bash
# Via CI/CD (não-bloqueante):
# .ci/QUALITY.yml executa automaticamente

# Relatórios salvos em:
# quality/reports/

# Dashboard atualizado em:
# quality/dashboard/
```

---

## 🎯 OBJETIVO

Manter alta qualidade de código através de **verificação contínua** sem interferir no desenvolvimento. Todas as ferramentas são configuradas para **reportar apenas**, permitindo que a equipe tome decisões conscientes sobre correções.

---

> **💡 DICA:** Execute `npm run quality:check` antes de cada commit para identificar problemas cedo. Use `npm run quality:report` semanalmente para análise mais profunda.