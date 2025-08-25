# 🧪 Smoke Tests - MadenAI

## Objetivo

Os smoke tests verificam a **disponibilidade básica** do sistema sem validar lógica de negócio complexa.

### O que É Testado
- ✅ Rotas estão configuradas e acessíveis
- ✅ Módulos principais podem ser importados
- ✅ Componentes básicos renderizam sem erro

### O que NÃO É Testado
- ❌ Lógica de negócio específica
- ❌ Interações complexas entre componentes
- ❌ Validação de dados ou fluxos completos
- ❌ Performance ou otimizações

---

## Estrutura

```
tests/
├── smoke/
│   ├── routes.test.js      # Verificação de rotas
│   ├── imports.test.js     # Verificação de imports
│   └── runner.js           # Executor principal
├── snapshots/
│   ├── routes-baseline.json    # Estado esperado das rotas
│   └── imports-baseline.json   # Estado esperado dos imports
└── README.md               # Este arquivo
```

---

## Como Executar

### 1. Via Node.js (Recomendado)

```bash
# Executar todos os testes
node tests/smoke/runner.js

# Executar teste específico
node tests/smoke/routes.test.js
node tests/smoke/imports.test.js
```

### 2. Via Browser (Console do Dev Tools)

```javascript
// Carregar na página e executar
runAllSmokeTests()

// Ou testes individuais
smokeTestRoutes()
smokeTestImports()
```

### 3. Via Script Package.json

```bash
# Adicionar ao package.json (futuro):
npm run smoke-test
```

---

## Interpretação dos Resultados

### ✅ Sucesso (Esperado)
```
📊 RESUMO DOS SMOKE TESTS
========================================
Total: 25
Passou: 25
Falhou: 0
Duração: 45ms
Taxa de sucesso: 100.0%

🎉 Todos os smoke tests passaram!
```

### ⚠️ Falha (Investigar)
```
📊 RESUMO DOS SMOKE TESTS
========================================
Total: 25
Passou: 22
Falhou: 3
Duração: 67ms
Taxa de sucesso: 88.0%

⚠️ 3 teste(s) falharam
```

**Se houver falhas:**
1. Verificar se arquivos/rotas foram movidos ou removidos
2. Atualizar snapshots se mudanças são intencionais
3. Investigar problemas de configuração se falhas são inesperadas

---

## Manutenção

### Quando Atualizar Snapshots
- ✅ Novas rotas foram adicionadas
- ✅ Rotas antigas foram removidas intencionalmente
- ✅ Estrutura de módulos foi refatorada
- ✅ Componentes foram reorganizados

### Como Atualizar
1. Execute os testes: `node tests/smoke/runner.js`
2. Compare com snapshots em `/tests/snapshots/`
3. Se mudanças são intencionais, atualize os arquivos JSON
4. Commit as mudanças nos snapshots

---

## Integração com CI/CD

### GitHub Actions (Exemplo)
```yaml
name: Smoke Tests
on: [push, pull_request]
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: node tests/smoke/runner.js
```

### Frequência Recomendada
- 🔄 **A cada commit**: Testes básicos de rotas
- 🔄 **A cada deploy**: Todos os smoke tests
- 🔄 **Diariamente**: Verificação completa + snapshots

---

## Limitações

1. **Não substitui testes unitários** - São apenas verificações básicas
2. **Não testa integrações** - Supabase, N8N, etc precisam de testes específicos
3. **Não valida UI/UX** - Apenas disponibilidade técnica
4. **Não testa performance** - Foco em funcionamento básico

---

## Próximos Passos

1. **Integrar com package.json** - Adicionar scripts npm
2. **Automatizar snapshots** - Geração automática de baselines
3. **Expandir cobertura** - Adicionar mais módulos conforme crescimento
4. **CI/CD Integration** - Configurar pipelines automatizados

---

## Troubleshooting

### Erro: "Module not found"
- Verificar se arquivo existe no caminho especificado
- Validar aliases TypeScript (@/ paths)
- Confirmar dependências instaladas

### Erro: "Route not configured"
- Verificar App.tsx para rotas atuais
- Atualizar lista em routes.test.js
- Regenerar snapshot se necessário

### Performance lenta
- Smoke tests devem ser rápidos (< 100ms)
- Se demorar muito, investigar imports pesados
- Considerar lazy loading para componentes grandes