# 🔧 VARIÁVEIS DE AMBIENTE - MadenAI

> **Data:** 2025-08-25  
> **Modo:** SAFE MODE - Documentação de ambiente  
> **Projeto:** MadenAI - Sistema de gestão de obras com IA

## 📋 OVERVIEW

O projeto MadenAI utiliza variáveis de ambiente para configurar integrações externas e parâmetros de runtime. **Não há arquivos .env em produção** - todas as configurações são feitas via Supabase Secrets ou hardcoded com valores públicos.

## 🗄️ SUPABASE (Backend Principal)

### 🔑 **Configuração Principal**
| Variável | Tipo | Obrigatória | Descrição | Valor Padrão |
|----------|------|-------------|-----------|--------------|
| `VITE_SUPABASE_URL` | string | ✅ **Sim** | URL do projeto Supabase | `https://[project-id].supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | string | ✅ **Sim** | Chave pública (anon key) | JWT público do Supabase |
| `VITE_SUPABASE_PROJECT_ID` | string | ✅ **Sim** | ID do projeto Supabase | Identificador único do projeto |

**⚠️ IMPORTANTE:** Estas são chaves **PÚBLICAS** e podem ser expostas no frontend. Não contêm informações sensíveis.

### 🔐 **Secrets do Supabase (Edge Functions)**
| Secret Name | Tipo | Obrigatória | Descrição | Acesso |
|-------------|------|-------------|-----------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | string | ✅ **Sim** | Chave de serviço (server-only) | Edge Functions apenas |
| `DATABASE_URL` | string | ⚠️ **Auto** | URL de conexão PostgreSQL | Auto-configurado |
| `JWT_SECRET` | string | ⚠️ **Auto** | Secret para JWT tokens | Auto-configurado |

## 🤖 N8N (Sistema de IA)

### 🌐 **Webhooks Configurados**
| Endpoint | Tipo | Obrigatória | Descrição | Timeout |
|----------|------|-------------|-----------|---------|
| `N8N_BASE_URL` | string | ✅ **Sim** | Base URL do N8N | `https://madeai-br.app.n8n.cloud` |
| `N8N_WEBHOOK_CHAT_GERAL` | string | ✅ **Sim** | Webhook chat geral | `/webhook/chat-geral` |
| `N8N_WEBHOOK_PROJETO_CHAT` | string | ✅ **Sim** | Webhook chat projeto | `/webhook/projeto-chat` |
| `N8N_WEBHOOK_ORCAMENTO_IA` | string | ✅ **Sim** | Webhook orçamento IA | `/webhook/orcamento-ia` |
| `N8N_WEBHOOK_CRONOGRAMA_IA` | string | ✅ **Sim** | Webhook cronograma IA | `/webhook/cronograma-ia` |
| `N8N_WEBHOOK_ANALISE_TECNICA` | string | ✅ **Sim** | Webhook análise técnica | `/webhook/analise-tecnica` |

**📝 NOTA:** URLs são **hardcoded** no código por serem públicos. Não requerem autenticação adicional.

## 🌐 APIs EXTERNAS

### 🌍 **Geolocalização**
| Variável | Tipo | Obrigatória | Descrição | Valor Padrão |
|----------|------|-------------|-----------|--------------|
| `IPIFY_API_URL` | string | ⚠️ **Opcional** | API para obter IP público | `https://api.ipify.org?format=json` |
| `GEOLOCATION_API_KEY` | string | ⚠️ **Opcional** | Chave API de geolocalização | Via Supabase Edge Functions |

### 📧 **Sistema de Email**
| Variável | Tipo | Obrigatória | Descrição | Acesso |
|----------|------|-------------|-----------|--------|
| `EMAIL_SERVICE_API_KEY` | string | ⚠️ **Opcional** | Chave do serviço de email | Supabase Secrets apenas |
| `SMTP_HOST` | string | ⚠️ **Opcional** | Servidor SMTP | Via Supabase Auth |
| `SMTP_PORT` | number | ⚠️ **Opcional** | Porta SMTP | `587` (padrão) |

## ⚡ VITE (Build Tool)

### 🏗️ **Configuração de Build**
| Variável | Tipo | Obrigatória | Descrição | Valor Padrão |
|----------|------|-------------|-----------|--------------|
| `NODE_ENV` | string | ⚠️ **Auto** | Ambiente de execução | `development` / `production` |
| `VITE_DEV_PORT` | number | ❌ **Não** | Porta do servidor dev | `8080` |
| `VITE_PREVIEW_PORT` | number | ❌ **Não** | Porta do preview | `4173` |
| `VITE_HOST` | string | ❌ **Não** | Host do servidor | `::` (todos os IPs) |

### 🔧 **Otimizações**
| Variável | Tipo | Obrigatória | Descrição | Valor Padrão |
|----------|------|-------------|-----------|--------------|
| `VITE_BUILD_TARGET` | string | ❌ **Não** | Target de build | `esnext` |
| `VITE_CHUNK_SIZE_WARNING` | number | ❌ **Não** | Limite de aviso de chunk | `800` KB |
| `VITE_SOURCEMAP` | boolean | ❌ **Não** | Gerar sourcemap | `true` (dev) / `false` (prod) |

## 🎨 FRONTEND (React)

### 🖼️ **Assets e CDN**
| Variável | Tipo | Obrigatória | Descrição | Valor Padrão |
|----------|------|-------------|-----------|--------------|
| `VITE_BASE_URL` | string | ❌ **Não** | URL base da aplicação | `/` |
| `VITE_ASSETS_CDN` | string | ❌ **Não** | CDN para assets | Auto-detectado |
| `VITE_PUBLIC_PATH` | string | ❌ **Não** | Caminho público | `/` |

### 🔍 **Debug e Analytics**
| Variável | Tipo | Obrigatória | Descrição | Valor Padrão |
|----------|------|-------------|-----------|--------------|
| `VITE_DEBUG_MODE` | boolean | ❌ **Não** | Modo debug | `false` |
| `VITE_ANALYTICS_ID` | string | ❌ **Não** | ID do analytics | Não configurado |
| `VITE_SENTRY_DSN` | string | ❌ **Não** | DSN do Sentry | Não configurado |

## 🔒 SEGURANÇA

### 🛡️ **Configurações de Segurança**
| Variável | Tipo | Obrigatória | Descrição | Valor Padrão |
|----------|------|-------------|-----------|--------------|
| `VITE_ENABLE_CSP` | boolean | ❌ **Não** | Content Security Policy | `false` |
| `VITE_SECURE_COOKIES` | boolean | ❌ **Não** | Cookies seguros | `true` (prod) |
| `VITE_DISABLE_DEVTOOLS` | boolean | ❌ **Não** | Desabilitar devtools | `false` |

### 🔐 **Headers de Segurança**
| Variável | Tipo | Obrigatória | Descrição | Valor Padrão |
|----------|------|-------------|-----------|--------------|
| `VITE_X_FRAME_OPTIONS` | string | ❌ **Não** | Proteção contra iframe | `DENY` |
| `VITE_X_CONTENT_TYPE_OPTIONS` | string | ❌ **Não** | Proteção MIME | `nosniff` |

## 🌍 AMBIENTES

### 🏠 **Desenvolvimento Local**
```bash
NODE_ENV=development
VITE_SUPABASE_URL=https://mozqijzvtbuwuzgemzsm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_PROJECT_ID=mozqijzvtbuwuzgemzsm
VITE_DEBUG_MODE=true
```

### 🚀 **Produção (Lovable)**
```bash
NODE_ENV=production
VITE_SUPABASE_URL=https://mozqijzvtbuwuzgemzsm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_PROJECT_ID=mozqijzvtbuwuzgemzsm
VITE_DEBUG_MODE=false
VITE_SECURE_COOKIES=true
```

### 🧪 **Staging/Preview**
```bash
NODE_ENV=production
VITE_SUPABASE_URL=https://mozqijzvtbuwuzgemzsm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_PROJECT_ID=mozqijzvtbuwuzgemzsm
VITE_DEBUG_MODE=true
```

## 📊 VALIDAÇÃO E DEFAULTS

### ✅ **Variáveis Obrigatórias**
```typescript
// Validação no runtime (src/lib/env.ts)
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY', 
  'VITE_SUPABASE_PROJECT_ID'
];

requiredEnvVars.forEach(varName => {
  if (!import.meta.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

### 🔧 **Defaults Seguros**
```typescript
// Defaults aplicados automaticamente
export const envConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
  },
  n8n: {
    baseUrl: 'https://madeai-br.app.n8n.cloud',
    timeout: 30000,
    retries: 2,
  },
  app: {
    debugMode: import.meta.env.DEV || false,
    version: import.meta.env.PACKAGE_VERSION || '1.0.0',
  }
};
```

## 🚫 VARIÁVEIS NÃO UTILIZADAS

### ❌ **Configurações Desnecessárias**
```bash
# NÃO usar estas variáveis (comum em outros projetos):
REACT_APP_*           # React Create App (projeto usa Vite)
NEXT_PUBLIC_*         # Next.js (projeto é SPA Vite)
VUE_APP_*             # Vue (projeto é React)
DATABASE_URL          # Conexão direta (usa Supabase)
REDIS_URL             # Cache (não implementado)
SESSION_SECRET        # Sessões (usa Supabase Auth)
```

---

## 🎯 RESUMO EXECUTIVO

### ✅ **Configuração Mínima**
Para rodar o projeto, apenas **3 variáveis** são obrigatórias:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### 🔒 **Segurança**
- **Nenhuma** variável sensível no frontend
- **Secrets** gerenciados via Supabase
- **Chaves públicas** são seguras para exposição

### 🌐 **Integrações**
- **Supabase**: Backend completo
- **N8N**: URLs hardcoded (públicas)
- **APIs externas**: Via Edge Functions

---

> **📝 NOTA:** Este projeto foi projetado para **máxima simplicidade** de configuração. A maioria dos valores são hardcoded ou auto-detectados, minimizando a necessidade de configuração manual.