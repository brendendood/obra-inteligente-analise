# 🧪 Smoke Tests - MadenAI

Smoke tests são testes mínimos e isolados que validam funcionalidades críticas sem efeitos colaterais.

## 📋 O que testamos

### 🔧 Testes de Importação (`imports.test.js`)
- ✅ Validação de módulos públicos importáveis
- ✅ Verificação de funções críticas de segurança
- ✅ Componentes principais da aplicação

### 🌐 Testes de Rota (`routes.test.js`)
- ✅ Rotas principais respondem com status apropriados
- ✅ Páginas de autenticação acessíveis
- ✅ Endpoints administrativos protegidos

## 🚀 Como executar

### Execução completa (recomendado)
```bash
# Executar todos os smoke tests
node contracts/tests/smoke/run-all.js
```

### Execução individual
```bash
# Apenas testes de importação
node contracts/tests/smoke/imports.test.js

# Apenas testes de rota (requer servidor rodando)
node contracts/tests/smoke/routes.test.js
```

### Via npm (se configurado)
```bash
# Se adicionado ao package.json
npm run smoke-test
```

## ⚙️ Configuração

### Variáveis de ambiente
```bash
# URL base para testes de rota (padrão: http://localhost:8080)
export SMOKE_TEST_URL=http://localhost:3000
```

### Pré-requisitos para testes de rota
1. **Servidor deve estar rodando**:
   ```bash
   npm run dev
   # ou
   npm run preview
   ```

2. **Aguardar carregamento**:
   - Espere o servidor carregar completamente
   - Verifique se http://localhost:8080 está acessível

## 📊 Interpretando resultados

### ✅ Sucesso esperado
```
✅ Module Imports: PASS
✅ Route Responses: 5 passed, 0 failed
✨ All smoke tests passed!
```

### ⚠️ Falhas esperadas
Alguns status codes podem ser esperados:
- **401**: Rota requer autenticação (normal)
- **403**: Rota requer permissões específicas (normal)
- **404**: Rota não implementada (pode ser OK dependendo do contexto)

### ❌ Falhas críticas
- **Módulos não importáveis**: Problema de estrutura de código
- **Timeout de rede**: Servidor não está rodando
- **500**: Erro interno do servidor

## 🔒 Segurança dos testes

### ✅ Garantias de segurança
- **Sem side effects**: Testes não modificam dados
- **Somente leitura**: Apenas requisições GET
- **Isolados**: Não dependem de estado compartilhado
- **Rápidos**: Executam em segundos

### ❌ O que NÃO fazemos
- ❌ Não modificamos banco de dados
- ❌ Não enviamos emails
- ❌ Não criamos usuários
- ❌ Não uploadamos arquivos
- ❌ Não executamos operações de escrita

## 📁 Estrutura dos testes

```
contracts/tests/
├── smoke/
│   ├── imports.test.js    # Testa importação de módulos
│   ├── routes.test.js     # Testa resposta de rotas
│   └── run-all.js         # Executor principal
└── README.md              # Esta documentação
```

## 🛠️ Troubleshooting

### Erro: "Cannot find module"
```bash
# Verificar se está na raiz do projeto
pwd
ls -la contracts/tests/

# Executar do diretório correto
cd /path/to/madenai
node contracts/tests/smoke/run-all.js
```

### Erro: "Connection refused"
```bash
# Verificar se servidor está rodando
curl http://localhost:8080

# Iniciar servidor se necessário
npm run dev
```

### Erro: "Permission denied"
```bash
# Verificar permissões dos arquivos
chmod +x contracts/tests/smoke/*.js
```

## 🎯 Quando executar

### ✅ Execute sempre que:
- Fizer alterações em módulos públicos
- Modificar rotas principais
- Antes de fazer deploy
- Após alterações de dependências

### ⚠️ Execute com atenção quando:
- Servidor estiver instável
- Em ambiente de produção (somente leitura)
- Com conexão de rede limitada

## 📞 Suporte

Para problemas com smoke tests:
1. Verificar logs completos dos testes
2. Validar configuração do ambiente
3. Consultar documentação do projeto principal
4. Reportar issues específicas com logs anexados