# 🚀 SNAPSHOT - PONTOS DE ENTRADA E SERVIÇOS

> **Data do snapshot:** 2025-08-25  
> **Modo:** SAFE MODE - Mapeamento de entry points  
> **Objetivo:** Identificar todos os pontos de entrada, serviços e binários

## 🎯 PONTOS DE ENTRADA PRINCIPAIS

### ⚡ **ENTRY POINT PRIMÁRIO**
```typescript
📍 src/main.tsx
├─ React.StrictMode
├─ QueryClient setup (@tanstack/react-query)
├─ AuthProvider context
└─ React Router (createBrowserRouter)
```

### 🚀 **APLICAÇÃO REACT**
```typescript
📍 src/App.tsx
├─ Layout principal
├─ Routing configuration
├─ Theme provider (next-themes)
└─ Toast notifications (sonner)
```

## 🌐 WEB SERVICES E ROTAS

### 📱 **APLICAÇÃO SPA (Single Page Application)**
```
🌍 Frontend Routes:
├─ / (Landing Page)
├─ /login (Authentication)
├─ /dashboard (Main Dashboard)
├─ /projects (Project List)
├─ /upload (File Upload)
├─ /admin (Admin Panel)
├─ /crm (CRM Dashboard)
└─ /project/:id/* (Dynamic Project Routes)
    ├─ /project/:id/budget
    ├─ /project/:id/schedule  
    ├─ /project/:id/ai
    └─ /project/:id/documents
```

### 🔌 **SERVIÇOS DE INTEGRAÇÃO**

#### 🗄️ **Supabase Services**
```typescript
📍 src/integrations/supabase/client.ts
├─ Database connection
├─ Authentication service
├─ Real-time subscriptions
├─ File storage (buckets)
└─ RLS (Row Level Security)
```

#### 🤖 **N8N AI Agent Services**
```typescript
📍 src/utils/agents/agentConfig.ts
├─ General Chat: /webhook/chat-geral
├─ Project Chat: /webhook/projeto-chat  
├─ Budget AI: /webhook/orcamento-ia
├─ Schedule AI: /webhook/cronograma-ia
└─ Technical Analysis: /webhook/analise-tecnica
```

## 🧩 COMPONENTES DE SERVIÇO

### 🔐 **Authentication Services**
```typescript
📍 src/contexts/AuthContext.tsx
├─ Login/Logout handling
├─ User session management
├─ Profile management
└─ Permission control
```

### 🗃️ **State Management Services**
```typescript
📍 src/stores/
├─ authStore.ts (User authentication state)
├─ projectStore.ts (Project management)
├─ unifiedProjectStore.ts (Unified project state)
├─ adminStore.ts (Admin panel state)
└─ crmStore.ts (CRM functionality)
```

### 📊 **Data Services**
```typescript
📍 src/hooks/
├─ auth/ (Authentication hooks)
├─ projects/ (Project management hooks)
├─ admin/ (Admin operations hooks)
├─ budget/ (Budget calculation hooks)
├─ schedule/ (Schedule management hooks)
├─ crm/ (CRM operations hooks)
└─ ai/ (AI interaction hooks)
```

## 🔧 FERRAMENTAS E BINÁRIOS

### 📦 **Build Tools**
```json
📍 package.json scripts:
├─ "dev": "vite" (Development server)
├─ "build": "tsc -b && vite build" (Production build)
├─ "lint": "eslint" (Code linting)
├─ "preview": "vite preview" (Preview build)
└─ "type-check": "tsc --noEmit" (Type checking)
```

### ⚡ **Development Server**
```typescript
📍 vite.config.ts
├─ Dev server: localhost:8080
├─ HMR (Hot Module Replacement)
├─ TypeScript compilation
├─ React Fast Refresh
└─ Build optimization
```

## 🔌 ADAPTERS E CONECTORES

### 🌐 **API Adapters**
```typescript
📍 src/utils/agents/agentService.ts
├─ HTTP client for N8N webhooks
├─ Request/response transformation
├─ Error handling and retries
└─ Fallback response generation
```

### 📁 **File Upload Adapters**
```typescript
📍 src/utils/upload/
├─ File validation
├─ Supabase storage integration
├─ Progress tracking
└─ Error handling
```

### 📊 **Export Adapters**
```typescript
📍 src/utils/export/
├─ PDF generation (jsPDF)
├─ Excel export (xlsx)
├─ Data transformation
└─ File download handling
```

## 🔄 BACKGROUND SERVICES

### 📡 **Real-time Subscriptions**
```typescript
📍 Supabase Real-time:
├─ Project updates
├─ User status changes
├─ Data synchronization
└─ Notification triggers
```

### 🔄 **State Synchronization**
```typescript
📍 Context Providers:
├─ AuthProvider (User state sync)
├─ ProjectContext (Project data sync)
└─ ProjectDetailContext (Detail sync)
```

## 🚫 SERVIÇOS NÃO IDENTIFICADOS

### ❌ **Backend Services**
- Não há serviços backend próprios (Node.js, Python, etc.)
- Toda lógica backend é via Supabase + N8N

### ❌ **Cronjobs/Workers**
- Não há jobs agendados ou workers
- Processamento é síncrono via webhooks

### ❌ **Message Queues**
- Não há filas de mensagens
- Comunicação direta via HTTP/WebSocket

---

> **📋 RESUMO:** O sistema é uma SPA React com integração Supabase para dados e N8N para IA. Todos os pontos de entrada estão mapeados e funcionais, sem serviços backend adicionais ou workers complexos.