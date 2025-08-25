# Email Confirmation Telemetry

Este documento descreve os eventos de telemetria registrados durante o processo de confirmação de email na rota `/cadastro/confirmado`.

## Eventos Disponíveis

### 1. `email_verification_start`
Disparado quando a página de confirmação é carregada e detecta tokens na URL.

**Payload:**
```json
{
  "event": "email_verification_start",
  "timestamp": "2024-08-25T10:30:00.000Z",
  "route": "/cadastro/confirmado",
  "context": "email_verification",
  "details": {
    "tokenType": "access_token|refresh_token|token_hash|code|none",
    "hasToken": true,
    "type": "signup",
    "route": "/cadastro/confirmado"
  }
}
```

### 2. `email_verification_success`
Disparado quando a verificação é bem-sucedida (otimista ou background).

**Payload:**
```json
{
  "event": "email_verification_success",
  "timestamp": "2024-08-25T10:30:01.000Z",
  "route": "/cadastro/confirmado",
  "context": "email_verification",
  "details": {
    "tokenType": "access_token",
    "hasToken": true,
    "optimistic": true,
    "background": false,
    "durationMs": 1250,
    "route": "/cadastro/confirmado"
  }
}
```

### 3. `email_verification_timeout`
Disparado quando a verificação em background excede 6 segundos.

**Payload:**
```json
{
  "event": "email_verification_timeout",
  "timestamp": "2024-08-25T10:30:06.000Z",
  "route": "/cadastro/confirmado",
  "context": "email_verification",
  "details": {
    "tokenType": "token_hash",
    "hasToken": true,
    "durationMs": 6000,
    "error": "Timeout na verificação"
  }
}
```

### 4. `email_verification_error`
Disparado quando ocorre erro durante a verificação.

**Payload:**
```json
{
  "event": "email_verification_error",
  "timestamp": "2024-08-25T10:30:02.000Z",
  "route": "/cadastro/confirmado",
  "context": "email_verification",
  "details": {
    "tokenType": "token_hash",
    "hasToken": true,
    "error": "Invalid token",
    "durationMs": 1850
  }
}
```

### 5. `email_verification_invalid_token`
Disparado quando um token é detectado como inválido ou expirado.

**Payload:**
```json
{
  "event": "email_verification_invalid_token",
  "timestamp": "2024-08-25T10:30:00.500Z",
  "route": "/cadastro/confirmado",
  "context": "email_verification",
  "details": {
    "reason": "no_token_found|token_verification_failed",
    "tokenType": "none",
    "hasToken": false,
    "error": "Token expired"
  }
}
```

### 6. `email_verification_resend_requested`
Disparado quando o usuário solicita reenvio do email de confirmação.

**Payload:**
```json
{
  "event": "email_verification_resend_requested",
  "timestamp": "2024-08-25T10:31:00.000Z",
  "route": "/cadastro/confirmado",
  "context": "email_verification",
  "details": {
    "email": "user@example.com",
    "route": "/cadastro/confirmado"
  }
}
```

### 7. `email_verification_resend_success`
Disparado quando o reenvio de email é bem-sucedido.

**Payload:**
```json
{
  "event": "email_verification_resend_success",
  "timestamp": "2024-08-25T10:31:01.000Z",
  "route": "/cadastro/confirmado",
  "context": "email_verification",
  "details": {
    "email": "user@example.com",
    "route": "/cadastro/confirmado"
  }
}
```

### 8. `email_verification_resend_error`
Disparado quando o reenvio de email falha.

**Payload:**
```json
{
  "event": "email_verification_resend_error",
  "timestamp": "2024-08-25T10:31:01.500Z",
  "route": "/cadastro/confirmado",
  "context": "email_verification",
  "details": {
    "email": "user@example.com",
    "error": "Rate limit exceeded",
    "unexpected": false,
    "route": "/cadastro/confirmado"
  }
}
```

## Onde os Logs Aparecem

### Console do Navegador
Os logs aparecem em dois formatos:
1. **Formato legível**: `📊 EMAIL_VERIFICATION_EVENT: email_verification_start`
2. **Formato estruturado**: `TELEMETRY: {"event":"email_verification_start",...}`

### Filtragem de Logs

Para filtrar logs de confirmação de email especificamente:

**No Console do Navegador:**
```javascript
// Filtrar por contexto
console.log = (function(originalLog) {
  return function(...args) {
    if (args[0] && args[0].includes('EMAIL_VERIFICATION_EVENT')) {
      originalLog.apply(console, args);
    }
  };
})(console.log);

// Filtrar por rota
// Buscar por logs que contenham: "route": "/cadastro/confirmado"
```

**Através de Log Aggregation:**
```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "context": "email_verification" } },
        { "term": { "route": "/cadastro/confirmado" } }
      ]
    }
  }
}
```

## Padrão de Nomenclatura

Todos os eventos de confirmação seguem o padrão:
- **Prefixo**: `email_verification_`
- **Ações**: `start`, `success`, `timeout`, `error`, `invalid_token`, `resend_requested`, `resend_success`, `resend_error`
- **Contexto**: `email_verification`
- **Rota**: `/cadastro/confirmado`

## Consistência com Login

Os eventos de confirmação seguem o mesmo padrão dos eventos de login:
- Estrutura de payload similar
- Campos `context`, `route`, `timestamp` padronizados
- Estratégia de logging: `start` → `success|timeout|error`
- Best-effort logging (nunca quebra a aplicação)