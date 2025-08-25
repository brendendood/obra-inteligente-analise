# 🧪 SMOKE TESTS - MadenAI

> **Objetivo:** Testes mínimos não invasivos para verificar funcionalidade básica  
> **Modo:** SAFE MODE - Sem alteração de dados ou comportamento  
> **Data:** 2025-08-25

## 🎯 OVERVIEW DOS SMOKE TESTS

Os smoke tests verificam se:
1. **Rotas respondem** com status codes esperados
2. **Módulos podem ser importados** sem erros
3. **Componentes renderizam** sem falhas
4. **Integrações externas** estão acessíveis

**⚠️ IMPORTANTE:** Estes testes NÃO validam conteúdo, apenas funcionamento básico.

## 🚀 COMO EXECUTAR

### 📦 **Opção 1: Com Vitest (Recomendado)**
```bash
# Instalar Vitest (se necessário)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Executar todos os smoke tests
npm run test:smoke

# Executar testes específicos
npm run test:smoke -- smoke-routes
npm run test:smoke -- smoke-imports
npm run test:smoke -- smoke-components
```

### 🌐 **Opção 2: Testes Manuais (Browser)**
```bash
# Iniciar aplicação
npm run dev

# Abrir browser em http://localhost:8080
# Executar script manual em DevTools Console:
# (Ver arquivos em /manual/ para scripts)
```

### 🔧 **Opção 3: Node.js Scripts**
```bash
# Executar verificações básicas
node contracts/tests/smoke/manual/verify-imports.js
node contracts/tests/smoke/manual/verify-config.js
```

## 📁 ESTRUTURA DOS TESTES

```
contracts/tests/smoke/
├── basic/
│   ├── smoke-routes.test.ts          # Testa rotas principais
│   ├── smoke-imports.test.ts         # Testa importações
│   └── smoke-components.test.ts      # Testa renderização
├── integration/
│   ├── smoke-supabase.test.ts        # Testa Supabase
│   ├── smoke-n8n.test.ts             # Testa N8N (sem envio)
│   └── smoke-external.test.ts        # Testa APIs externas
├── manual/
│   ├── verify-routes.html            # Teste manual de rotas
│   ├── verify-imports.js             # Script de verificação
│   └── browser-checks.md             # Checklist manual
└── configs/
    ├── vitest.config.ts              # Configuração Vitest
    └── setup.ts                      # Setup dos testes
```

## 🧪 CONFIGURAÇÃO DE TESTES

### ⚙️ **scripts em package.json**
```json
{
  "scripts": {
    "test:smoke": "vitest run contracts/tests/smoke",
    "test:smoke:watch": "vitest contracts/tests/smoke",
    "test:smoke:ui": "vitest --ui contracts/tests/smoke"
  }
}
```

### 🔧 **vitest.config.ts**
```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./contracts/tests/smoke/configs/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../src'),
    },
  },
})
```

## 📊 MÉTRICAS DE SUCESSO

### ✅ **Critérios de Aprovação**
```
✅ Todas as rotas públicas retornam 200
✅ Rotas protegidas redirecionam (302) ou retornam 401
✅ Rota 404 funciona para URLs inexistentes
✅ Módulos principais importam sem erro
✅ Componentes UI renderizam estrutura básica
✅ Configurações carregam corretamente
✅ Supabase client inicializa
✅ N8N endpoints são acessíveis (status check)
```

### ⚠️ **Critérios de Falha**
```
❌ Rotas retornam 500 (erro de servidor)
❌ Imports geram exceções não tratadas
❌ Componentes falham ao renderizar
❌ Configurações contêm valores inválidos
❌ Supabase client não inicializa
❌ N8N endpoints inacessíveis
❌ Dependências críticas ausentes
```

## 🔄 EXECUÇÃO CONTÍNUA

### 🚀 **CI/CD Integration**
```yaml
# Exemplo para GitHub Actions
name: Smoke Tests
on: [push, pull_request]

jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:smoke
      - run: npm run build  # Verifica se build funciona
```

### 📅 **Execução Recomendada**
- **A cada deploy:** Smoke tests completos
- **Daily:** Testes de integração externa
- **Weekly:** Verificação manual completa
- **Monthly:** Revisão e atualização dos testes

## 🎯 **PRÓXIMOS PASSOS**

1. **Implementar Vitest** se não estiver configurado
2. **Executar testes** para linha de base
3. **Configurar CI/CD** para execução automática
4. **Monitorar falhas** e ajustar conforme necessário
5. **Expandir testes** baseado em necessidades específicas

---

> **💡 DICA:** Comece com os testes manuais para entender o comportamento atual, depois implemente os testes automatizados para CI/CD contínuo.