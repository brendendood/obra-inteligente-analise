# 🔧 CI Pipeline Scripts - Local Execution Guide

Este diretório contém pipelines de CI **NÃO BLOQUEANTES** para análise contínua da qualidade do código.

## 📋 Pipelines Disponíveis

### 📊 INVENTORY.yml
**Finalidade:** Geração automática de inventários e métricas do projeto
**Executa:**
- Indexação de arquivos TypeScript
- Análise de dependências
- Estatísticas de código
- Mapeamento de imports
- Índice de documentação

### 🔍 QUALITY.yml  
**Finalidade:** Verificações de qualidade de código
**Executa:**
- TypeScript compilation check
- ESLint analysis
- Security audit
- Code metrics
- TODO/FIXME analysis

### 🧪 SMOKE.yml
**Finalidade:** Testes básicos de integridade
**Executa:**
- Build test
- Import resolution check
- Component structure validation
- Configuration verification

## 🚀 Como Habilitar no GitHub

### 1. **Copiar para .github/workflows/**
```bash
# OPCIONAL: Mover pipelines para ativação
cp .ci/INVENTORY.yml .github/workflows/inventory.yml
cp .ci/QUALITY.yml .github/workflows/quality.yml  
cp .ci/SMOKE.yml .github/workflows/smoke.yml
```

### 2. **Configurar Permissões**
```yaml
# Adicionar em cada arquivo .yml se necessário:
permissions:
  contents: read
  actions: read
```

### 3. **Personalizar Triggers**
```yaml
# Exemplo: executar apenas em PRs para main
on:
  pull_request:
    branches: [main]
  workflow_dispatch:
```

## 💻 Execução Local

### 📊 **Inventory Local**
```bash
# Gerar inventário de arquivos
mkdir -p .ci/artifacts

# Listar arquivos TypeScript
find src -type f -name "*.ts" -o -name "*.tsx" | head -100

# Estatísticas básicas
echo "TypeScript files: $(find src -name "*.ts" -o -name "*.tsx" | wc -l)"
echo "Components: $(find src/components -name "*.tsx" | wc -l)"
echo "Hooks: $(find src/hooks -name "*.ts" | wc -l)"

# Top imports
grep -r "import.*from" src/ | \
  sed "s/.*import.*from ['\"]\\([^'\"]*\\)['\"].*/\\1/" | \
  sort | uniq -c | sort -nr | head -20
```

### 🔍 **Quality Local**
```bash
# Criar diretório de relatórios
mkdir -p .ci/quality

# TypeScript check
npx tsc --noEmit --skipLibCheck

# ESLint check  
npx eslint src --ext .ts,.tsx

# Security audit
npm audit

# Buscar TODOs
grep -r "TODO\|FIXME" src/
```

### 🧪 **Smoke Tests Local**
```bash
# Criar diretório de testes
mkdir -p .ci/smoke

# Test build
npm run build

# Verificar imports suspeitos
grep -r "import.*\\.\\./\\.\\./\\.\\./" src/ || echo "No deep imports found"

# Verificar imports proibidos (/archive)
grep -r "import.*archive" src/ || echo "No archive imports found"

# Verificar estrutura
echo "UI components: $(find src/components/ui -name "*.tsx" | wc -l)"
echo "Custom hooks: $(find src/hooks -name "*.ts" | wc -l)"
```

## 📋 Scripts Automatizados

### **run-local-checks.sh**
```bash
#!/bin/bash
echo "🔍 Executando verificações locais..."

# Quality checks
echo "📝 TypeScript check..."
npx tsc --noEmit --skipLibCheck || echo "TypeScript issues found"

echo "🎨 ESLint check..."  
npx eslint src --ext .ts,.tsx || echo "ESLint warnings found"

echo "🏗️ Build test..."
npm run build || echo "Build failed"

echo "✅ Verificações locais concluídas!"
```

### **generate-local-report.sh**
```bash
#!/bin/bash
echo "📊 Gerando relatório local..."

mkdir -p .ci/local

# Estatísticas básicas
echo "📋 PROJECT STATS - $(date)" > .ci/local/stats.txt
echo "TypeScript files: $(find src -name "*.ts" -o -name "*.tsx" | wc -l)" >> .ci/local/stats.txt
echo "Components: $(find src/components -name "*.tsx" | wc -l)" >> .ci/local/stats.txt

# Top imports
echo "🔗 TOP IMPORTS" > .ci/local/imports.txt
grep -r "import.*from" src/ | \
  sed "s/.*import.*from ['\"]\\([^'\"]*\\)['\"].*/\\1/" | \
  sort | uniq -c | sort -nr | head -10 >> .ci/local/imports.txt

echo "✅ Relatório salvo em .ci/local/"
```

## ⚙️ Configuração Personalizada

### **Customizar Triggers**
```yaml
# Exemplo: executar apenas em mudanças específicas
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - 'tsconfig.json'
```

### **Configurar Notificações**
```yaml
# Exemplo: notificar apenas em falhas
- name: Notify on Failure
  if: failure()
  run: echo "Quality checks failed - review required"
```

### **Personalizar Artifacts**
```yaml
# Exemplo: manter artifacts por mais tempo
- name: Upload Results
  uses: actions/upload-artifact@v4
  with:
    name: custom-reports
    path: .ci/reports/
    retention-days: 90  # 3 meses
```

## 🔒 Considerações de Segurança

### **Dados Sensíveis**
- ❌ **Nunca incluir** tokens ou secrets nos artifacts
- ✅ **Usar GitHub Secrets** para dados sensíveis
- ✅ **Validar** que logs não expõem informações confidenciais

### **Permissões Mínimas**
```yaml
permissions:
  contents: read      # Leitura do código
  actions: read       # Leitura de workflows
  # NÃO incluir: write permissions desnecessárias
```

## 📈 Interpretação de Resultados

### **🟢 Indicadores Saudáveis**
- TypeScript: 0 errors
- ESLint: < 10 warnings
- Build: SUCCESS
- Security: 0 high/critical vulnerabilities
- TODO/FIXME: < 20 items

### **🟡 Atenção Requerida**
- TypeScript: 1-5 errors
- ESLint: 10-50 warnings  
- Build: SUCCESS mas com warnings
- Security: 1-2 moderate vulnerabilities
- TODO/FIXME: 20-50 items

### **🔴 Ação Necessária**
- TypeScript: > 5 errors
- ESLint: > 50 warnings
- Build: FAILED
- Security: Any high/critical vulnerabilities
- TODO/FIXME: > 50 items

---

**💡 Dica:** Execute verificações locais antes de commits para detectar issues cedo!

*Última atualização: 25/08/2025*