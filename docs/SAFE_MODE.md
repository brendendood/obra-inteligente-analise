# 🔒 MODO SEGURO - SAFE MODE

## 📋 ESCOPO E OBJETIVO

Este documento define as regras do **MODO SEGURO** para implementações no projeto MadenAI. O objetivo é permitir **apenas** atividades organizacionais e documentais, preservando 100% da funcionalidade existente.

## 🚫 PROIBIÇÕES RIGOROSAS

### ❌ **CÓDIGO DE RUNTIME**
- Não alterar lógica de negócio, algoritmos ou fluxos
- Não modificar comportamento de componentes React
- Não alterar hooks, contextos ou stores
- Não modificar rotas, navegação ou estrutura de páginas
- Não alterar contratos de API ou schemas de dados

### ❌ **ARQUITETURA E CONFIGURAÇÃO**
- Não modificar builds, deploys ou configurações de produção
- Não alterar variáveis de ambiente ou configurações Supabase
- Não modificar pipelines CI/CD existentes
- Não alterar dependências de produção
- Não mover/renomear arquivos sem compatibilidade total

### ❌ **FUNCIONALIDADES**
- Não introduzir features novas
- Não alterar UX/UI existente
- Não modificar design system ou estilos
- Não alterar nomes de funções, classes ou módulos públicos
- Não alterar contratos públicos ou interfaces

## ✅ PERMITIDO EM MODO SEGURO

### 📚 **DOCUMENTAÇÃO**
- Criar documentação técnica e organizacional
- Gerar snapshots do estado atual
- Documentar arquitetura existente
- Criar guias e manuais

### 🗂️ **ORGANIZAÇÃO NÃO-DESTRUTIVA**
- Criar estruturas em `/docs/`
- Criar scripts de análise em `/quality/` (não-bloqueantes)
- Criar ferramentas de verificação em `/.ci/` (não-bloqueantes)
- Adicionar metadados organizacionais

### 🔍 **ANÁLISE E AUDITORIA**
- Gerar relatórios de estrutura
- Mapear dependências
- Documentar padrões existentes
- Criar inventários técnicos

## 📋 CHECKLIST PRÉ-IMPLEMENTAÇÃO

Antes de qualquer ação, confirmar:

- [ ] A tarefa é puramente organizacional/documental
- [ ] Nenhum arquivo de runtime será modificado
- [ ] Nenhuma dependência de produção será alterada
- [ ] Nenhum comportamento será alterado
- [ ] 100% de compatibilidade retroativa mantida

## 📋 CHECKLIST PÓS-IMPLEMENTAÇÃO

Após qualquer ação, verificar:

- [ ] Apenas arquivos em `/docs/`, `/quality/`, `/.ci/` foram criados
- [ ] Nenhum arquivo de runtime foi modificado
- [ ] Build e testes continuam funcionando
- [ ] Nenhum contrato público foi alterado
- [ ] Sistema permanece funcional

## ⚠️ PROTOCOLO DE EMERGÊNCIA

Se qualquer risco for detectado:

1. **PARAR** imediatamente a implementação
2. **REVERTER** todas as mudanças
3. **GERAR** relatório de bloqueio
4. **REPORTAR** o problema detectado

## 🎯 FILOSOFIA DO MODO SEGURO

> "Organizar sem quebrar, documentar sem alterar, melhorar sem modificar."

O MODO SEGURO garante que todas as atividades sejam **aditivas** e **não-destrutivas**, permitindo organização e documentação sem qualquer risco ao sistema em produção.