# 🛣️ INVENTÁRIO - ROTAS, MIDDLEWARES E JOBS

> **Data do snapshot:** 2025-08-25  
> **Modo:** SAFE MODE - Mapeamento de rotas e serviços  
> **Escopo:** Frontend SPA, integrações e jobs

## 🌐 ROTAS HTTP (Frontend SPA)

### 📱 **Rotas Públicas**
| Rota | Componente | Descrição | Middleware |
|------|------------|-----------|------------|
| `/` | `LandingPage` | Landing page principal | Nenhum |
| `/login` | `Login` | Página de login | Nenhum |
| `/cadastro` | `Signup` | Página de cadastro | Nenhum |
| `/signup` | `Navigate → /cadastro` | Redirect para cadastro | Nenhum |
| `/reset-password` | `ResetPassword` | Reset de senha | LazyWrapper |
| `/auth/callback` | `ConfirmAccount` | Callback de auth Supabase | Nenhum |
| `/confirm-email` | `ConfirmEmail` | Confirmação de email | Nenhum |
| `/termos` | `Terms` | Termos de uso | LazyWrapper |
| `/terms` | `Terms` | Termos (EN) | LazyWrapper |
| `/politica` | `Privacy` | Política de privacidade | LazyWrapper |
| `/privacy` | `Privacy` | Política (EN) | LazyWrapper |
| `/v/*` | `Redirect` | Redirects diversos | Nenhum |

### 🔐 **Rotas Protegidas**
| Rota | Componente | Descrição | Middleware |
|------|------------|-----------|------------|
| `/painel` | `Dashboard` | Dashboard principal | `ProtectedRoute` |
| `/dashboard` | `Navigate → /painel` | Redirect para painel | `ProtectedRoute` |
| `/app` | `Navigate → /painel` | Redirect para painel | `ProtectedRoute` |
| `/projetos` | `Navigate → /painel` | Redirect para painel | `ProtectedRoute` |
| `/obras` | `Navigate → /painel` | Redirect para painel | `ProtectedRoute` |
| `/upload` | `Upload` | Upload de arquivos | `ProtectedRoute` |
| `/ia` | `AIGeneral` | IA geral | `ProtectedRoute` |
| `/conta` | `Account` | Configurações da conta | `ProtectedRoute` |
| `/plano` | `Plan` | Planos e assinatura | `ProtectedRoute` |
| `/ajuda` | `Help` | Central de ajuda | `ProtectedRoute` |
| `/contato` | `Contact` | Página de contato | `ProtectedRoute` |
| `/crm` | `CRMPage` | Dashboard CRM | `ProtectedRoute` |

### 👑 **Rotas Administrativas**
| Rota | Componente | Descrição | Middleware |
|------|------------|-----------|------------|
| `/admin` | `Navigate → /admin-panel` | Redirect para admin | `ProtectedRoute` |
| `/admin-panel` | `AdminPage` | Painel administrativo | `ProtectedRoute` |
| `/admin-panel/crm-user/:userId` | `AdminCRMUserDetail` | Detalhes CRM do usuário | `ProtectedRoute` |
| `/admin/crm` | `AdminCRMManagement` | Gestão CRM admin | `ProtectedRoute` |

### 🎯 **Rotas de Projeto Específico**
| Rota | Componente | Descrição | Middleware |
|------|------------|-----------|------------|
| `/projeto/:projectId` | `ProjectLayout` | Layout do projeto | `ProtectedRoute` |
| `/projeto/:projectId/` | `ProjectSpecificOverview` | Overview do projeto | `ProtectedRoute` + `LazyWrapper` |
| `/projeto/:projectId/orcamento` | `ProjectSpecificBudget` | Orçamento do projeto | `ProtectedRoute` + `LazyWrapper` |
| `/projeto/:projectId/cronograma` | `ProjectSpecificSchedule` | Cronograma do projeto | `ProtectedRoute` + `LazyWrapper` |
| `/projeto/:projectId/assistente` | `ProjectSpecificAssistant` | Assistente IA do projeto | `ProtectedRoute` + `LazyWrapper` |
| `/projeto/:projectId/documentos` | `ProjectSpecificDocumentsPage` | Documentos do projeto | `ProtectedRoute` + `LazyWrapper` |
| `/ia/:projectId` | `ProjectSpecificAssistant` | IA específica do projeto | `ProtectedRoute` + `LazyWrapper` |

### 🚫 **Rota de Fallback**
| Rota | Componente | Descrição | Middleware |
|------|------------|-----------|------------|
| `*` | `NotFound` | Página 404 | `LazyWrapper` |

## 🛡️ MIDDLEWARES E GUARDS

### 🔐 **ProtectedRoute Component**
```typescript
Localização: src/components/auth/ProtectedRoute.tsx
Função: Proteção de rotas autenticadas
Dependências:
├── useAuth() hook
├── AuthContext
├── React Router (Navigate)
└── Loading states

Comportamento:
├── Verifica autenticação do usuário
├── Redireciona para /login se não autenticado
├── Mostra loading durante verificação
└── Renderiza children se autenticado
```

### ⚡ **LazyWrapper Component**
```typescript
Localização: src/components/ui/lazy-wrapper.tsx
Função: Code splitting e lazy loading
Dependências:
├── React.Suspense
├── UnifiedLoading
└── ErrorBoundary

Comportamento:
├── Carregamento lazy de componentes
├── Fallback de loading unificado
├── Error handling para chunks falhos
└── Otimização de bundle splitting
```

### 🌐 **QueryClient Provider**
```typescript
Localização: App.tsx
Função: Estado de servidor global
Configuração:
├── refetchOnWindowFocus: false
├── refetchOnReconnect: 'always'
├── refetchOnMount: 'always'
├── refetchInterval: false
└── staleTime: 5 minutos

Comportamento:
├── Cache de requisições
├── Background refetch
├── Optimistic updates
└── Error retry logic
```

## 🔗 INTEGRAÇÕES E WEBHOOKS

### 🤖 **N8N Webhooks (AI Agents)**
| Endpoint | Função | Timeout | Retries |
|----------|--------|---------|---------|
| `/webhook/chat-geral` | Chat geral | 30s | 2 |
| `/webhook/projeto-chat` | Chat de projeto | 30s | 2 |
| `/webhook/orcamento-ia` | IA de orçamento | 45s | 1 |
| `/webhook/cronograma-ia` | IA de cronograma | 45s | 1 |
| `/webhook/analise-tecnica` | Análise técnica | 60s | 1 |

```typescript
Base URL: https://madeai-br.app.n8n.cloud/webhook
Headers: Content-Type: application/json
Method: POST
Fallbacks: Respostas locais configuradas
```

### 🗄️ **Supabase APIs**
| Serviço | Função | Configuração |
|---------|--------|-------------|
| **Auth API** | Autenticação | JWT, RLS, MFA |
| **Database API** | CRUD operations | PostgreSQL, Real-time |
| **Storage API** | File upload/download | Buckets, Policies |
| **Edge Functions** | Serverless functions | Deno runtime |
| **Realtime API** | WebSocket subscriptions | Broadcast, Presence |

### 📡 **APIs Externas**
| Serviço | Função | Uso |
|---------|--------|-----|
| **IP Geolocation API** | Localização por IP | Admin geolocation |
| **Email Services** | Envio de emails | Notifications, confirmações |
| **Referral Validation** | Validação de códigos | Sistema de referência |

## 🔄 JOBS E PROCESSOS ASSÍNCRONOS

### ⚡ **Real-time Subscriptions (Supabase)**
```typescript
Assinatura de Projetos:
├── Tabela: projects
├── Evento: INSERT, UPDATE, DELETE
├── Filtro: user_id = auth.uid()
└── Callback: updateUnifiedStore()

Assinatura de Auth:
├── Tabela: auth.users (metadata)
├── Evento: onAuthStateChange
├── Filtro: session changes
└── Callback: updateAuthStore()
```

### 🔄 **Background Tasks**
```typescript
❌ NENHUM CRONJOB IDENTIFICADO
❌ NENHUMA FILA DE MENSAGENS
❌ NENHUM WORKER BACKGROUND

✅ Processamento via:
├── React Query background refetch
├── Supabase real-time updates
├── N8N webhook responses
└── Client-side scheduled updates
```

### 📊 **Geolocation Jobs**
```typescript
Admin Geolocation Enhancement:
├── Trigger: Manual (Admin Panel)
├── Função: supabase.functions.invoke('ip-geolocation-enhanced')
├── Processamento: Batch de IPs sem localização
├── Resultado: Atualização de geolocation_data
└── Frequência: On-demand

IP Detection:
├── Trigger: Login events
├── API: https://api.ipify.org?format=json
├── Processamento: Client-side
├── Storage: user_sessions.ip_address
└── Frequência: A cada login
```

## 🗂️ FILAS E CONSUMIDORES

### ❌ **Não Implementado**
```
Message Queues: Não há filas implementadas
Workers: Não há workers background
Cronjobs: Não há jobs agendados
Background Processing: Tudo é síncrono/real-time
```

### ✅ **Alternativas Implementadas**
```typescript
Real-time Updates: Supabase WebSocket
Background Refetch: React Query
Async Processing: N8N Webhooks (síncrono)
File Processing: Client-side (html2canvas, jsPDF)
Export Jobs: Client-side generation
```

## 🖥️ CLIs E SCRIPTS

### 📦 **Package.json Scripts**
| Script | Comando | Função |
|--------|---------|--------|
| `dev` | `vite` | Desenvolvimento local |
| `build` | `tsc -b && vite build` | Build de produção |
| `lint` | `eslint` | Verificação de código |
| `preview` | `vite preview` | Preview do build |
| `type-check` | `tsc --noEmit` | Verificação de tipos |

### ⚙️ **Build Tools**
```bash
Vite CLI:
├── vite dev (port 8080)
├── vite build
├── vite preview
└── vite optimize

TypeScript CLI:
├── tsc --build
├── tsc --noEmit
└── tsc --watch

ESLint CLI:
├── eslint src/**/*.{ts,tsx}
├── eslint --fix
└── eslint --cache
```

### 🗄️ **Supabase CLI** (Não usado diretamente)
```bash
❌ NÃO CONFIGURADO NO PROJETO

Potencial uso:
├── supabase init
├── supabase start
├── supabase migration new
├── supabase db reset
└── supabase functions deploy
```

## 📊 MÉTRICAS E MONITORAMENTO

### 📈 **Analytics** (Não implementado formalmente)
```typescript
❌ Google Analytics não configurado
❌ Mixpanel não configurado  
❌ Posthog não configurado

✅ Tracking manual via:
├── Console.log events
├── Supabase database logs
├── N8N webhook logs
└── Browser DevTools
```

### 🔍 **Logging**
```typescript
Frontend Logging:
├── console.log (desenvolvimento)
├── useToast (user notifications)
├── Error boundaries
└── Network request logs

Backend Logging:
├── Supabase database logs
├── Supabase auth logs
├── Edge function logs
└── N8N execution logs
```

---

## 🎯 **RESUMO DE ARQUITETURA**

### ✅ **Características Principais**
- **SPA React** com roteamento client-side
- **Supabase backend** para dados e auth
- **N8N webhooks** para processamento IA
- **Real-time updates** via WebSocket
- **Lazy loading** para otimização
- **Proteção de rotas** via auth guard

### ⚠️ **Limitações Identificadas**
- Sem jobs background ou filas
- Sem analytics formais
- Sem monitoring de performance
- Sem CI/CD pipeline
- Processamento limitado ao client-side

### 🎯 **Recomendações**
- Implementar analytics (PostHog/Mixpanel)
- Configurar monitoring (Sentry)
- Adicionar performance monitoring
- Implementar health checks
- Configurar alertas automatizados

---

> **🛣️ CONCLUSÃO:** Sistema SPA moderno com arquitetura bem definida. Rotas organizadas, proteção adequada, mas com oportunidades de melhoria em observabilidade e processamento background.