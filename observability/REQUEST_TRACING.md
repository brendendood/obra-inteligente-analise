# 🔍 Request Tracing - MadenAI

## Objetivo

Documentação para implementação de rastreamento de requests com correlation IDs, request IDs e headers específicos para observabilidade completa.

---

## Conceitos Fundamentais

### Request ID vs Correlation ID

| Conceito | Descrição | Escopo | Exemplo |
|----------|-----------|---------|---------|
| **Request ID** | Identificador único por request HTTP | Single request | `req_1692345678_abc123def` |
| **Correlation ID** | Identificador compartilhado entre requests relacionados | Multi-request flow | `corr_user_signup_1692345678` |
| **Session ID** | Identificador da sessão do usuário | User session | `sess_fae0ee4b_1692345678` |
| **Trace ID** | Identificador de trace distribuído | Entire user journey | `trace_signup_to_first_project` |

---

## Headers de Rastreamento

### Headers Padrão (Para Implementação Futura)

```typescript
interface TracingHeaders {
  'X-Request-ID': string;           // Único por request
  'X-Correlation-ID': string;       // Compartilhado entre requests relacionados
  'X-Session-ID': string;           // Sessão do usuário
  'X-User-ID': string;              // ID do usuário (quando autenticado)
  'X-Trace-Parent': string;         // Parent trace (formato OpenTelemetry)
  'X-Trace-State': string;          // Estado do trace
}
```

### Headers Existentes (Supabase)

```typescript
interface SupabaseHeaders {
  'Authorization': 'Bearer <token>';
  'apikey': '<anon_key>';
  'Content-Type': 'application/json';
  'Prefer': 'return=minimal';
}
```

---

## Implementação por Camada

### 1. Frontend (React)

#### Context Provider para Tracing
```typescript
// Estrutura para implementação futura
interface TracingContext {
  requestId: string;
  correlationId: string;
  sessionId: string;
  userId?: string;
  generateNewRequestId: () => string;
  setCorrelationId: (id: string) => void;
}

// Exemplo de uso futuro:
const { requestId, correlationId } = useTracing();
```

#### HTTP Client com Tracing
```typescript
// Adapter para fetch/axios (futuro)
class TracingHttpClient {
  async request(config: RequestConfig) {
    const headers = {
      ...config.headers,
      'X-Request-ID': generateRequestId(),
      'X-Correlation-ID': getCurrentCorrelationId(),
      'X-Session-ID': getSessionId(),
      'X-User-ID': getCurrentUserId()
    };
    
    return fetch(config.url, { ...config, headers });
  }
}
```

### 2. Backend (Supabase Edge Functions)

#### Middleware de Tracing
```typescript
// Edge Function middleware (estrutura futura)
export function withTracing(handler: Function) {
  return async (req: Request) => {
    const requestId = req.headers.get('X-Request-ID') || generateRequestId();
    const correlationId = req.headers.get('X-Correlation-ID') || requestId;
    
    // Injetar no contexto da função
    const context = { requestId, correlationId };
    
    try {
      const response = await handler(req, context);
      
      // Adicionar headers de resposta
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Correlation-ID', correlationId);
      
      return response;
    } catch (error) {
      // Log com contexto de tracing
      console.error(`[${requestId}] Error:`, error);
      throw error;
    }
  };
}
```

### 3. Database (PostgreSQL)

#### Função para Log com Tracing
```sql
-- Estrutura futura para logging com tracing
CREATE OR REPLACE FUNCTION log_with_tracing(
  p_level text,
  p_message text,
  p_request_id text DEFAULT NULL,
  p_correlation_id text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL,
  p_context jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO observability_logs (
    level,
    message,
    request_id,
    correlation_id,
    user_id,
    context,
    created_at
  ) VALUES (
    p_level,
    p_message,
    p_request_id,
    p_correlation_id,
    COALESCE(p_user_id, auth.uid()),
    p_context,
    now()
  );
END;
$$;
```

---

## Flows de Rastreamento

### 1. User Signup Flow
```
[Frontend] POST /auth/signup
├─ Request-ID: req_signup_1692345678_abc
├─ Correlation-ID: corr_user_signup_1692345678
│
[Supabase Auth] trigger: handle_new_user_profile
├─ Request-ID: req_profile_1692345678_def  
├─ Correlation-ID: corr_user_signup_1692345678  ← SAME
│
[Edge Function] send_welcome_email
├─ Request-ID: req_email_1692345678_ghi
├─ Correlation-ID: corr_user_signup_1692345678  ← SAME
│
[N8N Webhook] Email delivery
├─ Request-ID: req_n8n_1692345678_jkl
├─ Correlation-ID: corr_user_signup_1692345678  ← SAME
```

### 2. Project Creation Flow
```
[Frontend] POST /api/projects
├─ Request-ID: req_create_1692345678_aaa
├─ Correlation-ID: corr_project_create_1692345678
│
[Supabase] INSERT into projects
├─ Request-ID: req_db_1692345678_bbb
├─ Correlation-ID: corr_project_create_1692345678  ← SAME
│
[N8N] AI Analysis trigger
├─ Request-ID: req_ai_1692345678_ccc
├─ Correlation-ID: corr_project_create_1692345678  ← SAME
```

---

## Configuração de Ambiente

### Variáveis de Ambiente

```bash
# Observabilidade (futuro)
ENABLE_REQUEST_TRACING=false           # Desabilitado por padrão
REQUEST_TRACING_SAMPLE_RATE=0.1        # 10% sampling em prod
CORRELATION_ID_HEADER=X-Correlation-ID
REQUEST_ID_HEADER=X-Request-ID

# Integração com ferramentas externas (futuro)
JAEGER_ENDPOINT=http://localhost:14268/api/traces
ZIPKIN_ENDPOINT=http://localhost:9411/api/v2/spans
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

### Ativação em Desenvolvimento

```typescript
// No logger_adapter.ts
logger.configure({
  enableToasts: true,
  enableSupabaseLogging: process.env.ENABLE_REQUEST_TRACING === 'true'
});

// Headers automáticos em dev
if (process.env.NODE_ENV === 'development') {
  // Interceptar fetch para adicionar headers automaticamente
  const originalFetch = window.fetch;
  window.fetch = (input, init = {}) => {
    const headers = new Headers(init.headers);
    
    if (!headers.has('X-Request-ID')) {
      headers.set('X-Request-ID', generateRequestId());
    }
    
    return originalFetch(input, { ...init, headers });
  };
}
```

---

## Ferramentas de Observabilidade

### 1. Browser Dev Tools

#### Console Filtering
```javascript
// Filtrar por Request ID
console.log = new Proxy(console.log, {
  apply: (target, thisArg, args) => {
    if (sessionStorage.getItem('trace_mode') === 'true') {
      const requestId = getRequestContext().requestId;
      return target.apply(thisArg, [`[${requestId}]`, ...args]);
    }
    return target.apply(thisArg, args);
  }
});
```

#### Network Tab Correlation
```javascript
// Adicionar request ID a todas as requests para fácil correlação
fetch('/api/endpoint', {
  headers: {
    'X-Request-ID': 'req_1692345678_abc123'
  }
});
```

### 2. Supabase Dashboard

#### Query para Rastreamento
```sql
-- Buscar todos os logs de um correlation ID
SELECT 
  created_at,
  level,
  message,
  request_id,
  correlation_id,
  context
FROM observability_logs 
WHERE correlation_id = 'corr_user_signup_1692345678'
ORDER BY created_at;

-- Buscar requests de um usuário específico
SELECT 
  user_id,
  request_id,
  correlation_id,
  message,
  created_at
FROM observability_logs 
WHERE user_id = 'user-uuid-here'
  AND created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at;
```

### 3. N8N Workflows

#### Tracing Headers em Webhooks
```json
{
  "headers": {
    "X-Request-ID": "{{ $json.request_id }}",
    "X-Correlation-ID": "{{ $json.correlation_id }}",
    "X-Source": "madenai-webhook"
  }
}
```

---

## Implementação Gradual

### Fase 1: Headers Básicos (Futuro)
- [x] Documentação criada
- [ ] Request ID generation
- [ ] Correlation ID propagation
- [ ] Frontend interceptors

### Fase 2: Backend Integration (Futuro)
- [ ] Edge Function middleware
- [ ] Database logging functions
- [ ] Supabase RPC tracing

### Fase 3: Observabilidade Completa (Futuro)
- [ ] OpenTelemetry integration
- [ ] Distributed tracing
- [ ] Metrics collection
- [ ] Alerting

---

## Testing

### Manual Testing

```bash
# 1. Ativar modo trace no browser
sessionStorage.setItem('trace_mode', 'true');

# 2. Executar operação (ex: criar projeto)
# 3. Verificar console logs com Request IDs
# 4. Verificar Network tab para correlation

# 5. Query no Supabase para verificar logs
```

### Automated Testing

```typescript
// Estrutura futura para testes de tracing
describe('Request Tracing', () => {
  it('should propagate correlation ID across requests', async () => {
    const correlationId = 'test_corr_123';
    
    // Mock com correlation ID
    const response = await apiClient.createProject({
      name: 'Test Project'
    }, { correlationId });
    
    // Verificar se correlation ID foi propagado
    expect(response.headers['X-Correlation-ID']).toBe(correlationId);
  });
});
```

---

## Troubleshooting

### Problemas Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| Headers perdidos | CORS configuration | Adicionar headers customizados ao CORS |
| Request ID duplicado | Cache/retry logic | Gerar novo ID a cada retry |
| Correlation quebrada | Middleware ausente | Verificar propagação em cada camada |
| Performance impact | Logging excessivo | Implementar sampling rate |

### Debug Commands

```typescript
// Verificar contexto atual
console.log('Current tracing context:', getRequestContext());

// Forçar geração de novo correlation ID
setCorrelationId(generateCorrelationId());

// Verificar headers de request
console.log('Request headers:', Object.fromEntries(headers.entries()));
```

---

## Próximos Passos

1. **Implementar geração de Request IDs** no logger adapter
2. **Criar interceptors** para fetch/axios
3. **Configurar middleware** nas Edge Functions
4. **Implementar sampling** para reduzir overhead
5. **Integrar com ferramentas** de observabilidade (Jaeger, Zipkin)

---

## Referencias

- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otel/)
- [W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [HTTP Correlation ID Best Practices](https://blog.rapid7.com/2016/12/23/the-value-of-correlation-ids/)