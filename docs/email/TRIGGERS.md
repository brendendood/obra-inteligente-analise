# 🚀 Sistema de Triggers de E-mail - MadenAI

## Visão Geral

O sistema de triggers garante que emails importantes sejam enviados automaticamente durante eventos específicos do usuário.

## 📧 Trigger: Welcome User Email

### Fluxo Automatizado

```mermaid
graph TD
    A[Usuário se cadastra] --> B[Trigger: on_auth_user_created]
    B --> C[Function: handle_new_user_profile]
    C --> D[Criar perfil + gamificação]
    D --> E[pg_notify: send_welcome_email]
    E --> F[Edge Function: process-welcome-emails]
    F --> G[Chamar: send-custom-emails]
    G --> H[Template: welcome_user]
    H --> I[Email enviado via Resend]
    I --> J[Log registrado em email_logs]
```

### Componentes do Sistema

#### 1. **Database Trigger**
- **Tabela:** `auth.users`
- **Evento:** `AFTER INSERT`
- **Trigger:** `on_auth_user_created`
- **Função:** `handle_new_user_profile()`

#### 2. **Notificação PostgreSQL**
- **Canal:** `send_welcome_email`
- **Payload:** `{ user_id, email, full_name, timestamp }`
- **Disparo:** Automático quando `email_confirmed_at IS NOT NULL`

#### 3. **Edge Function de Processamento**
- **Função:** `process-welcome-emails`
- **Gatilho:** Chamada manual ou cron job
- **Responsabilidade:** Processar usuários confirmados sem welcome email

#### 4. **Sistema de Envio**
- **Função:** `send-custom-emails`
- **Template:** `welcome_user`
- **Provedor:** Resend.com
- **Domínio:** `@madeai.com.br`

## 🔧 Como Funciona

### Cenário 1: Cadastro + Confirmação Imediata
1. Usuário se cadastra em `/cadastro`
2. Confirma email via link recebido
3. `email_confirmed_at` é preenchido
4. Trigger dispara automaticamente
5. Welcome email é enviado

### Cenário 2: Confirmação Tardia
1. Usuário se cadastra mas não confirma imediatamente
2. Sistema não envia welcome email (correto)
3. Usuário confirma email dias depois
4. Edge function `process-welcome-emails` detecta e envia

### Cenário 3: Falha de Envio
1. Welcome email falha por qualquer motivo
2. Não fica registrado como 'sent' em `email_logs`
3. Próxima execução de `process-welcome-emails` reprocessa
4. Sistema tenta novamente até conseguir

## ⚙️ Configuração e Testes

### 🧪 Testando em Local/Staging

#### Teste 1: Cadastro Completo
```bash
# 1. Simular cadastro novo
curl -X POST http://localhost:54321/rest/v1/rpc/test_complete_signup_system \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"

# 2. Verificar logs
supabase functions logs process-welcome-emails --follow
```

#### Teste 2: Processamento Manual
```bash
# Chamar edge function diretamente
curl -X POST http://localhost:54321/functions/v1/process-welcome-emails \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

#### Teste 3: Verificar Estado
```sql
-- Usuários sem welcome email
SELECT 
  up.user_id,
  up.full_name,
  au.email,
  au.email_confirmed_at,
  up.created_at
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id
LEFT JOIN email_logs el ON (el.user_id = up.user_id AND el.email_type = 'welcome_user' AND el.status = 'sent')
WHERE au.email_confirmed_at IS NOT NULL
  AND el.id IS NULL
  AND up.created_at >= NOW() - INTERVAL '30 days'
ORDER BY up.created_at DESC;
```

### 🔍 Monitoramento

#### Logs de Sucesso
```sql
SELECT 
  el.sent_at,
  el.recipient_email,
  el.status,
  el.template_key
FROM email_logs el
WHERE el.email_type = 'welcome_user'
  AND el.sent_at >= NOW() - INTERVAL '7 days'
ORDER BY el.sent_at DESC;
```

#### Logs de Falha
```sql
SELECT 
  el.sent_at,
  el.recipient_email,
  el.status,
  el.metadata
FROM email_logs el
WHERE el.email_type = 'welcome_user'
  AND el.status != 'sent'
  AND el.sent_at >= NOW() - INTERVAL '7 days'
ORDER BY el.sent_at DESC;
```

## 🔄 Retry e Recuperação

### Sistema de Retry
- **Automático:** Via `process-welcome-emails` executado periodicamente
- **Condição:** Usuários confirmados sem welcome email registrado
- **Frequência:** Configurável (recomendado: diário)
- **Limite:** 30 dias após cadastro

### Recuperação Manual
```bash
# Para reprocessar todos os usuários pendentes
curl -X POST https://mozqijzvtbuwuzgemzsm.supabase.co/functions/v1/process-welcome-emails \
  -H "Authorization: Bearer SERVICE_ROLE_KEY"
```

## 📊 Métricas e KPIs

### Indicadores de Saúde
1. **Taxa de Entrega:** % de welcome emails enviados vs cadastros confirmados
2. **Tempo de Latência:** Tempo entre confirmação e envio do welcome
3. **Taxa de Falha:** % de emails que falharam no envio
4. **Reprocessamento:** Quantos emails precisaram de retry

### Alertas Recomendados
- Welcome email não enviado após 1 hora da confirmação
- Taxa de falha > 5% em 24 horas
- Mais de 10 usuários pendentes acumulados

## 🛡️ Segurança e Boas Práticas

### Controles Implementados
- ✅ Verificação de `email_confirmed_at` antes do envio
- ✅ Prevenção de duplicatas via `email_logs`
- ✅ Rate limiting via Resend
- ✅ Logs estruturados para auditoria
- ✅ Fallback para reprocessamento

### Limitações Conhecidas
- Dependência do Resend para entrega
- Processamento assíncrono pode ter latência
- Não há notificação em tempo real de falhas

## 🔧 Manutenção

### Tarefas Periódicas
1. **Semanal:** Revisar logs de falha
2. **Mensal:** Analisar métricas de entrega
3. **Trimestral:** Otimizar templates e conteúdo

### Troubleshooting
- **Email não chega:** Verificar Resend dashboard e spam
- **Falha sistemática:** Revisar API key e domínio verificado
- **Performance:** Considerar batch processing para alto volume

---

*Documentação atualizada em: Janeiro 2025*  
*Versão do sistema: v2.0*