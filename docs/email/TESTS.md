# 📧 Guia de Testes - Sistema de E-mail MadeAI

## 🎯 Visão Geral

Este documento contém procedimentos completos para testar e validar o sistema de e-mail da plataforma MadeAI em todos os ambientes (local, staging, produção).

---

## 🔧 Configuração de Ambiente de Teste

### 1. **Ambiente Local (Desenvolvimento)**

#### **Resend Sandbox Mode**
```bash
# Verificar se está em modo sandbox
RESEND_API_KEY="re_test_..." # Chave de teste sempre começa com re_test_
```

#### **Configuração Supabase Local**
```bash
# Verificar edge functions locais
supabase functions serve --env-file .env.local

# Testar função específica
curl -X POST "http://localhost:54321/functions/v1/send-confirmation-email" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### 2. **Staging (Pré-produção)**
- URL: `https://madeai.com.br` (staging)
- API Key: Resend produção com domínio verificado
- Logs: Dashboard Supabase + Console Resend

### 3. **Produção**
- URL: `https://madeai.com.br` (produção)
- API Key: Resend produção completa
- Monitoramento: 24/7 via logs estruturados

---

## 📋 Fluxos de Teste por Funcionalidade

### 🆕 **1. Cadastro (/cadastro)**

#### **Cenário Base:**
1. Acessar `/cadastro`
2. Preencher formulário completo
3. Submeter cadastro
4. **Esperado:** E-mail de confirmação enviado

#### **Pontos de Verificação:**
```sql
-- Verificar registro na tabela email_logs
SELECT * FROM email_logs 
WHERE email = 'teste@exemplo.com' 
AND template_type = 'signup_confirmation'
ORDER BY created_at DESC;
```

#### **E-mails Disparados:**
- ✅ **Confirmação de conta** (imediato)
- ✅ **Boas-vindas** (após confirmar)
- ✅ **Onboarding Step 1** (5 min delay)

### ✅ **2. Confirmação de Conta**

#### **Cenário Base:**
1. Receber e-mail de confirmação
2. Clicar no link de verificação
3. **Esperado:** Redirect para `/cadastro/confirmado?success=verificado`

#### **URLs de Teste:**
```
✅ Sucesso: /cadastro/confirmado?success=verificado
❌ Token ausente: /cadastro/confirmado?error=token-ausente
❌ Token inválido: /cadastro/confirmado?error=token-invalido
❌ Erro interno: /cadastro/confirmado?error=erro-interno
```

#### **Logs a Verificar:**
```bash
# Edge Function verify-email
supabase functions logs verify-email --follow

# Buscar por "Verification error" ou "Email verified successfully"
```

### 🔐 **3. Recuperação de Senha**

#### **Cenário Base:**
1. Acessar `/reset-password`
2. Inserir e-mail válido
3. **Esperado:** E-mail de reset enviado

#### **Template Usado:** `password_reset`

#### **Verificação:**
```sql
-- Verificar tentativa de reset
SELECT * FROM email_logs 
WHERE email = 'usuario@exemplo.com' 
AND template_type = 'password_reset'
AND created_at >= NOW() - INTERVAL '1 hour';
```

### 🔔 **4. Notificações Gerais**

#### **Templates Disponíveis:**
- `welcome_user` - Boas-vindas pós-confirmação
- `account_deactivated` - Conta desativada
- `onboarding_step1` - Primeiro passo onboarding
- `notification_general` - Notificações diversas

#### **Teste Manual:**
```sql
-- Disparar notificação via SQL (apenas desenvolvimento)
SELECT pg_notify('send_welcome_email', json_build_object(
    'user_id', 'UUID_DO_USUARIO',
    'email', 'teste@exemplo.com',
    'full_name', 'Nome Teste'
)::text);
```

---

## 🔍 Verificação e Debugging

### **1. Logs Estruturados (Supabase)**

#### **Consultar Logs de E-mail:**
```sql
-- Últimos 50 e-mails enviados
SELECT 
    email,
    template_type,
    status,
    resend_id,
    error_message,
    created_at
FROM email_logs 
ORDER BY created_at DESC 
LIMIT 50;
```

#### **Estatísticas de Envio:**
```sql
-- Status de envios por template
SELECT 
    template_type,
    status,
    COUNT(*) as total,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY template_type), 2) as percentage
FROM email_logs 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY template_type, status
ORDER BY template_type, status;
```

### **2. Dashboard Resend**

#### **Métricas a Monitorar:**
- **Delivery Rate:** > 98%
- **Bounce Rate:** < 2%
- **Complaint Rate:** < 0.1%
- **API Usage:** < 80% da quota

#### **Acesso:**
1. Login em [resend.com](https://resend.com)
2. Navegar para **Logs** > **Recent Activity**
3. Filtrar por domínio: `@madeai.com.br`

### **3. Edge Functions Logs**

#### **Comandos Úteis:**
```bash
# Logs em tempo real
supabase functions logs send-confirmation-email --follow
supabase functions logs send-custom-emails --follow
supabase functions logs verify-email --follow

# Buscar por erros específicos
supabase functions logs send-confirmation-email | grep "error"
```

---

## ⚠️ Troubleshooting - Erros Comuns

### **❌ API Key Inválida**

#### **Sintomas:**
- Status `failed` em email_logs
- Error: "Invalid API key"

#### **Verificação:**
```bash
# Testar API key diretamente
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer re_XXXXX" \
  -H "Content-Type: application/json" \
  -d '{"from": "test@madeai.com.br", "to": "test@teste.com", "subject": "Test", "html": "Test"}'
```

#### **Solução:**
1. Verificar se API key existe em **Project Settings > Functions**
2. Regenerar chave em resend.com se necessário

### **🌐 Domínio Não Verificado**

#### **Sintomas:**
- Error: "Domain not verified"
- E-mails não enviados de `@madeai.com.br`

#### **Verificação:**
1. Acessar [Resend Domains](https://resend.com/domains)
2. Verificar status de `madeai.com.br`
3. Verificar registros DNS (SPF, DKIM, DMARC)

### **📊 Quota Excedida**

#### **Sintomas:**
- Error: "Rate limit exceeded"
- Falhas em horários de pico

#### **Verificação:**
```sql
-- E-mails enviados na última hora
SELECT COUNT(*) FROM email_logs 
WHERE created_at >= NOW() - INTERVAL '1 hour'
AND status = 'sent';
```

#### **Solução:**
- Verificar plano Resend atual
- Implementar rate limiting se necessário

### **📧 Templates Não Encontrados**

#### **Sintomas:**
- Error: "Template not found"
- Status `failed` para tipos específicos

#### **Verificação:**
```sql
-- Verificar templates ativos
SELECT type, subject, active FROM email_templates WHERE active = true;
```

---

## 🧪 Cenários de Teste Automatizado

### **1. Teste de Carga (Load Testing)**

```bash
# Enviar 50 e-mails de teste em 1 minuto
for i in {1..50}; do
  curl -X POST "https://madeai.com.br/api/test-email" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"test${i}@teste.com\", \"type\": \"signup_confirmation\"}"
  sleep 1.2
done
```

### **2. Validação de Links**

```bash
# Testar se links de confirmação estão acessíveis
curl -I "https://madeai.com.br/cadastro/confirmado?success=verificado"
# Esperado: HTTP/1.1 200 OK
```

### **3. Verificação de Bounce/Spam**

#### **E-mails de Teste Específicos:**
```
valid@madeai.com.br       # ✅ Deve entregar
bounce@simulator.resend   # ❌ Deve bouncar
spam@simulator.resend     # ⚠️  Deve marcar como spam
```

---

## 📊 Monitoramento em Produção

### **1. Alertas Críticos**

#### **Configurar Monitoramento Para:**
- Taxa de falha > 5% em 15 min
- Bounce rate > 3% em 1 hora
- API errors > 10 em 5 min
- Domínio não verificado

### **2. Métricas Diárias**

```sql
-- Report diário de e-mails
SELECT 
    DATE(created_at) as data,
    template_type,
    COUNT(*) as total_enviados,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as sucessos,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as falhas,
    ROUND(COUNT(CASE WHEN status = 'sent' THEN 1 END) * 100.0 / COUNT(*), 2) as taxa_sucesso
FROM email_logs 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), template_type
ORDER BY data DESC, template_type;
```

### **3. Dashboard de Saúde**

#### **Indicadores de Saúde do Sistema:**
- 🟢 **Saudável:** Taxa sucesso > 95%
- 🟡 **Atenção:** Taxa sucesso 90-95%
- 🔴 **Crítico:** Taxa sucesso < 90%

---

## 🔄 Processo de Rollback

### **Em Caso de Falha Crítica:**

1. **Parar novos envios:**
   ```sql
   -- Desativar todos os templates temporariamente
   UPDATE email_templates SET active = false;
   ```

2. **Verificar logs:**
   ```bash
   supabase functions logs send-confirmation-email --limit 100
   ```

3. **Rollback de código (se necessário):**
   - Reverter commits problemáticos
   - Redeployar edge functions

4. **Reativar gradualmente:**
   ```sql
   -- Reativar template por template após validação
   UPDATE email_templates SET active = true WHERE type = 'signup_confirmation';
   ```

---

## 📚 Referências Úteis

- [Resend Documentation](https://resend.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Email Deliverability Best Practices](https://resend.com/docs/knowledge-base/deliverability)

---

**Última atualização:** 2025-08-25  
**Responsável:** Equipe DevOps MadeAI  
**Próxima revisão:** 2025-09-25