# 🧪 Email Smoke Tests - MadeAI

## 📋 Visão Geral

Este diretório contém testes de fumaça (smoke tests) para validar o sistema de e-mail da plataforma MadeAI. Os testes são projetados para verificar rapidamente se o sistema básico de envio de e-mails está funcionando sem afetar o ambiente de produção.

---

## 🛠️ Configuração

### 1. **Pré-requisitos**

```bash
# Instalar dependências (se necessário)
npm install resend
npm install -D typescript ts-node @types/node
```

### 2. **Configurar API Key Sandbox**

#### **Obter Chave Sandbox no Resend:**
1. Acesse [resend.com](https://resend.com)
2. Vá em **API Keys**
3. Crie uma nova chave com prefixo `re_test_` (sandbox)
4. Copie a chave completa

#### **Configurar Variável de Ambiente:**

**Opção A - Arquivo .env.local (recomendado):**
```bash
# Criar arquivo .env.local na raiz do projeto
echo "RESEND_API_KEY_SANDBOX=re_test_sua_chave_aqui" > .env.local
```

**Opção B - Variável de ambiente temporária:**
```bash
# Linux/Mac
export RESEND_API_KEY_SANDBOX="re_test_sua_chave_aqui"

# Windows
set RESEND_API_KEY_SANDBOX=re_test_sua_chave_aqui
```

### 3. **Verificar .env.example**

Certifique-se de que existe um placeholder no `.env.example`:
```bash
# .env.example
RESEND_API_KEY_SANDBOX=re_test_PLACEHOLDER_COLOQUE_SUA_CHAVE_SANDBOX_AQUI
```

---

## 🚀 Como Executar

### **Execução Simples**
```bash
# Na raiz do projeto
npx ts-node tests/email/smoke-email.ts
```

### **Com Variável Inline**
```bash
# Linux/Mac
RESEND_API_KEY_SANDBOX="re_test_sua_chave" npx ts-node tests/email/smoke-email.ts

# Windows
cmd /c "set RESEND_API_KEY_SANDBOX=re_test_sua_chave && npx ts-node tests/email/smoke-email.ts"
```

### **Via npm script (se configurado)**
```bash
npm run test:email:smoke
```

---

## 📊 Interpretando Resultados

### **✅ Sucesso Esperado**
```
🚀 MadeAI Email Smoke Test
=====================================
🔑 Validando API Key...
✅ API Key válida
🔹 Formato: re_test_ab...
🔹 Tipo: Sandbox
---
🧪 Iniciando Smoke Test - Sistema de E-mail
📧 Enviando e-mail de teste...
📤 Para: test@example.com
📨 De: onboarding@resend.dev
⏰ Timestamp: 2025-08-25T10:30:45.123Z
---
📝 Conteúdo preparado, enviando...
✅ SUCESSO: ✅ E-mail enviado com sucesso! ID: b049d8d1-1234-5678-9abc-defghijklmno
📋 Detalhes: {
  "emailId": "b049d8d1-1234-5678-9abc-defghijklmno",
  "recipient": "test@example.com",
  "sender": "onboarding@resend.dev",
  "apiKeyPrefix": "re_test_ab..."
}
=====================================
📊 RESULTADO FINAL:
Status: ✅ SUCESSO
Mensagem: ✅ E-mail enviado com sucesso! ID: b049d8d1-1234-5678-9abc-defghijklmno
Timestamp: 2025-08-25T10:30:45.123Z
```

### **❌ Falhas Comuns**

#### **1. API Key Não Configurada**
```
❌ ERRO CRÍTICO: RESEND_API_KEY_SANDBOX não encontrado. Verifique o arquivo .env.example
```
**Solução:** Configurar variável de ambiente conforme seção "Configuração"

#### **2. API Key Inválida**
```
❌ FALHA: Resend API Error: Invalid API key
```
**Solução:** Verificar se a chave está correta e é válida no dashboard Resend

#### **3. Quota Excedida**
```
❌ FALHA: Resend API Error: Rate limit exceeded
```
**Solução:** Aguardar reset da quota ou verificar plano Resend

#### **4. API Key de Produção**
```
⚠️  ATENÇÃO: API key não parece ser sandbox (deve começar com re_test_)
```
**Solução:** Usar uma chave sandbox (re_test_) em vez da produção

---

## 🎯 O Que o Teste Valida

### **Validações Automáticas:**
- ✅ API Key está configurada
- ✅ API Key tem formato válido (re_*)
- ✅ Conexão com Resend API
- ✅ Envio de e-mail HTML básico
- ✅ Resposta da API (ID do e-mail)
- ✅ Tags e metadados

### **Validações Visuais (e-mail enviado):**
- ✅ Template HTML renderizado
- ✅ Dados dinâmicos (data/hora)
- ✅ Formatação correta
- ✅ Links e estilos funcionais

---

## 🔒 Segurança e Boas Práticas

### **✅ Características Seguras:**
- 🔐 Usa apenas chaves sandbox (re_test_*)
- 📧 Envia apenas para test@example.com
- 🏷️ Marca e-mails com tags de teste
- 🚫 Não acessa banco de produção
- 📝 Logs detalhados para debugging

### **⚠️ Cuidados:**
- **Nunca** commitar chaves reais no git
- **Sempre** usar prefixo `re_test_` para testes
- **Verificar** se não está usando API key de produção
- **Limitar** execução em ambientes controlados

---

## 🔧 Personalização

### **Alterar Destinatário:**
```typescript
// Em smoke-email.ts, linha ~10
private testEmail = 'seu-email-teste@dominio.com';
```

### **Alterar Remetente:**
```typescript
// Em smoke-email.ts, linha ~11
private fromEmail = 'seu-remetente@resend.dev';
```

### **Adicionar Mais Validações:**
```typescript
// Exemplo: validar headers
const emailData = {
  // ... configuração existente
  headers: {
    'X-Test-Environment': 'smoke-test',
    'X-Test-Timestamp': new Date().toISOString()
  }
};
```

---

## 🐛 Troubleshooting

### **Problema: ts-node não encontrado**
```bash
# Instalar globalmente
npm install -g ts-node

# Ou usar npx (recomendado)
npx ts-node tests/email/smoke-email.ts
```

### **Problema: Módulo 'resend' não encontrado**
```bash
# Instalar dependência
npm install resend
```

### **Problema: Exit code 1**
- Indica falha no teste
- Verificar logs detalhados acima da mensagem final
- Seguir instruções de correção baseadas no erro específico

---

## 📅 Manutenção

### **Execução Recomendada:**
- ✅ **Antes de cada deploy**
- ✅ **Após mudanças no sistema de e-mail**
- ✅ **Semanalmente (automatizado)**
- ✅ **Após configuração de novos ambientes**

### **Atualizações:**
- Revisar mensalmente se templates estão atualizados
- Verificar se novas validações são necessárias
- Atualizar dependências conforme necessário

---

## 📚 Referências

- [Resend API Documentation](https://resend.com/docs)
- [Resend Testing Guide](https://resend.com/docs/send-with-nodejs)
- [TypeScript Node Setup](https://www.typescriptlang.org/docs/)

---

**Última atualização:** 2025-08-25  
**Responsável:** DevOps MadeAI  
**Próxima revisão:** 2025-09-25