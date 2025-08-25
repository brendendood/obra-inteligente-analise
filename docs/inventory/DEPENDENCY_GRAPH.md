# 🕸️ INVENTÁRIO - GRAFO DE DEPENDÊNCIAS

> **Data do snapshot:** 2025-08-25  
> **Modo:** SAFE MODE - Mapeamento de dependências  
> **Metodologia:** Análise de imports e arquitetura em camadas

## 🏗️ ARQUITETURA EM CAMADAS

<lov-mermaid>
graph TB
    %% Entry Points
    HTML[index.html] --> MAIN[src/main.tsx]
    MAIN --> APP[src/App.tsx]
    
    %% Core Providers
    APP --> AUTH_PROVIDER[AuthProvider]
    APP --> PROJECT_PROVIDER[ProjectProvider]
    APP --> IMPERSONATION[ImpersonationProvider]
    APP --> QUERY_CLIENT[QueryClient]
    
    %% Routing Layer
    APP --> ROUTES[React Router]
    ROUTES --> LANDING[LandingPage]
    ROUTES --> LOGIN[Login/Signup]
    ROUTES --> DASHBOARD[Dashboard]
    ROUTES --> UPLOAD[Upload]
    ROUTES --> ADMIN[AdminPage]
    ROUTES --> CRM[CRMPage]
    ROUTES --> PROJECT_PAGES[Project Pages]
    
    %% Project Specific Routes
    PROJECT_PAGES --> OVERVIEW[ProjectOverview]
    PROJECT_PAGES --> BUDGET[ProjectBudget]
    PROJECT_PAGES --> SCHEDULE[ProjectSchedule]
    PROJECT_PAGES --> ASSISTANT[ProjectAssistant]
    PROJECT_PAGES --> DOCUMENTS[ProjectDocuments]
    
    %% State Management Layer
    AUTH_PROVIDER --> AUTH_STORE[authStore]
    PROJECT_PROVIDER --> UNIFIED_STORE[unifiedProjectStore]
    ADMIN --> ADMIN_STORE[adminStore]
    CRM --> CRM_STORE[crmStore]
    
    %% Context Layer
    AUTH_PROVIDER --> AUTH_CONTEXT[AuthContext]
    PROJECT_PROVIDER --> PROJECT_CONTEXT[ProjectContext]
    PROJECT_PAGES --> PROJECT_DETAIL[ProjectDetailContext]
    
    %% Integration Layer
    AUTH_STORE --> SUPABASE[Supabase Client]
    UNIFIED_STORE --> SUPABASE
    PROJECT_DETAIL --> SUPABASE
    ASSISTANT --> AI_AGENTS[AI Agent System]
    
    %% External Services
    AI_AGENTS --> N8N[N8N Webhooks]
    SUPABASE --> POSTGRES[(PostgreSQL)]
    SUPABASE --> STORAGE[(File Storage)]
    SUPABASE --> REALTIME[Real-time]
</lov-mermaid>

## 📦 DEPENDÊNCIAS ENTRE MÓDULOS

### 🎯 **Entry Points → Core Providers**
```
src/main.tsx
└── src/App.tsx
    ├── @/contexts/AuthProvider
    ├── @/contexts/ProjectContext  
    ├── @/contexts/ImpersonationContext
    ├── @tanstack/react-query (QueryClient)
    └── react-router-dom (BrowserRouter)
```

### 🔐 **Authentication Layer**
```
AuthProvider.tsx
├── @/contexts/AuthContext
├── @/hooks/useAuth
├── @/stores/authStore
└── @/integrations/supabase/client

AuthContext.tsx
├── @/integrations/supabase/client
├── @/hooks/useUserData
└── @/utils/auth

useAuth.ts (Hook)
├── @/stores/authStore
├── @/integrations/supabase/client
└── zustand
```

### 📊 **Project Management Layer**
```
ProjectContext.tsx
├── @/stores/unifiedProjectStore
├── @/hooks/useProjects
├── @/integrations/supabase/client
└── @tanstack/react-query

ProjectDetailContext.tsx
├── @/hooks/useProjectDetail
├── @/integrations/supabase/client
├── @/contexts/AuthContext
└── react-router-dom (params)

unifiedProjectStore.ts
├── @/integrations/supabase/client
├── @/lib/utils
└── zustand
```

### 🎨 **UI Component Dependencies**

<lov-mermaid>
graph TD
    %% UI Foundation
    UTILS[lib/utils.ts] --> UI_COMPONENTS[UI Components]
    CVA[class-variance-authority] --> UI_COMPONENTS
    RADIX[Radix UI Primitives] --> UI_COMPONENTS
    
    %% Core UI Components
    UI_COMPONENTS --> BUTTON[Button]
    UI_COMPONENTS --> CARD[Card]
    UI_COMPONENTS --> INPUT[Input]
    UI_COMPONENTS --> DIALOG[Dialog]
    UI_COMPONENTS --> TABLE[Table]
    
    %% Composite Components
    BUTTON --> FORMS[Form Components]
    CARD --> LAYOUTS[Layout Components]
    TABLE --> DATA_DISPLAY[Data Display]
    DIALOG --> MODALS[Modal Components]
    
    %% Domain Components
    FORMS --> AUTH_FORMS[Auth Forms]
    LAYOUTS --> SIDEBAR[Sidebar]
    DATA_DISPLAY --> ADMIN_TABLES[Admin Tables]
    MODALS --> PROJECT_DIALOGS[Project Dialogs]
    
    %% Page Components
    AUTH_FORMS --> LOGIN_PAGE[Login Page]
    SIDEBAR --> DASHBOARD[Dashboard]
    ADMIN_TABLES --> ADMIN_PAGE[Admin Page]
    PROJECT_DIALOGS --> PROJECT_PAGES[Project Pages]
</lov-mermaid>

### 🤖 **AI Agent System**
```
AI Components
├── @/utils/agents/agentService
├── @/utils/agents/agentConfig
└── @/utils/agents/agentTypes

agentService.ts
├── agentConfig.ts
├── agentTypes.ts
└── N8N Webhooks

agentConfig.ts
├── agentTypes.ts
└── fallbacks/
    ├── generalFallback.ts
    ├── projectFallback.ts
    ├── budgetFallback.ts
    ├── scheduleFallback.ts
    └── analysisFallback.ts
```

## 🔌 DEPENDÊNCIAS EXTERNAS

### 📚 **Bibliotecas Core**
```
React Ecosystem:
├── react (18.3.1)
├── react-dom (18.3.1)
├── react-router-dom (6.26.2)
├── @tanstack/react-query (5.56.2)
└── zustand (5.0.6)

UI & Styling:
├── @radix-ui/* (40+ components)
├── tailwindcss
├── class-variance-authority
├── tailwind-merge
├── lucide-react (icons)
└── framer-motion (animations)
```

### 🗄️ **Backend & Integração**
```
Supabase Stack:
├── @supabase/supabase-js (2.50.0)
├── @supabase/auth-helpers-nextjs (0.10.0)
└── PostgreSQL (via Supabase)

AI & External APIs:
├── N8N Webhooks
├── IP Geolocation Services
└── Email Services
```

### 🛠️ **Utilitários & Ferramentas**
```
Data Processing:
├── date-fns (dates)
├── uuid (IDs)
├── zod (validation)
├── dompurify (sanitization)
└── xlsx (Excel export)

File & Export:
├── react-dropzone (upload)
├── file-saver (download)
├── jspdf (PDF generation)
├── html2canvas (screenshots)
└── canvas-confetti (celebrations)
```

## 📊 GRAFO DE DEPENDÊNCIAS CRÍTICAS

<lov-mermaid>
graph LR
    %% Critical Path
    MAIN[main.tsx] --> APP[App.tsx]
    APP --> AUTH[AuthProvider]
    APP --> PROJECT[ProjectProvider]
    
    %% Authentication Critical Path
    AUTH --> AUTH_STORE[authStore]
    AUTH_STORE --> SUPABASE[Supabase Client]
    SUPABASE --> POSTGRES[(Database)]
    
    %% Project Critical Path  
    PROJECT --> UNIFIED[unifiedProjectStore]
    UNIFIED --> SUPABASE
    
    %% UI Critical Path
    APP --> UI[UI Components]
    UI --> UTILS[lib/utils]
    UI --> RADIX[Radix Primitives]
    
    %% Pages Critical Path
    APP --> PAGES[Page Components]
    PAGES --> HOOKS[Custom Hooks]
    HOOKS --> STORES[Zustand Stores]
    STORES --> SUPABASE
    
    %% AI Critical Path
    PAGES --> AI[AI Components]
    AI --> AGENTS[Agent Service]
    AGENTS --> N8N[N8N Webhooks]
    
    style MAIN fill:#ff6b6b
    style AUTH fill:#4ecdc4
    style PROJECT fill:#45b7d1
    style SUPABASE fill:#96ceb4
    style N8N fill:#ffeaa7
</lov-mermaid>

## 🔄 DEPENDÊNCIAS CIRCULARES

### ⚠️ **Potenciais Problemas Identificados**
```
❌ NENHUMA DEPENDÊNCIA CIRCULAR DETECTADA

✅ Arquitetura bem estruturada:
├── Entry Points → Providers → Stores → Services
├── UI Components → Utils (unidirecional)
├── Pages → Hooks → Stores (unidirecional)
└── Services → External APIs (unidirecional)
```

## 📈 **Métricas de Dependência**

### 🔢 **Estatísticas**
- **Total de módulos:** ~400 arquivos
- **Dependências externas:** 60+ pacotes
- **Profundidade máxima:** 6 níveis
- **Fan-out médio:** 4-8 dependências por módulo
- **Fan-in médio:** 2-15 importações por módulo

### 🏆 **Módulos Mais Dependidos**
1. `lib/utils.ts` - 100+ dependentes
2. `integrations/supabase/client.ts` - 80+ dependentes
3. `hooks/useAuth.ts` - 50+ dependentes
4. `components/ui/button.tsx` - 100+ dependentes
5. `components/ui/card.tsx` - 80+ dependentes

### 🎯 **Módulos Centrais (High Fan-out)**
1. `App.tsx` - 20+ dependências diretas
2. `AuthProvider.tsx` - 15+ dependências
3. `Dashboard.tsx` - 25+ dependências
4. `AdminPage.tsx` - 30+ dependências

---

## 🎯 **ANÁLISE DE SAÚDE ARQUITETURAL**

### ✅ **Pontos Fortes**
- Separação clara de responsabilidades
- Arquitetura em camadas bem definida
- Sem dependências circulares
- Reutilização eficiente de componentes UI
- Padrões consistentes de hooks e stores

### ⚠️ **Pontos de Atenção**
- Alto fan-out em algumas páginas (AdminPage)
- Muitas dependências UI (possível over-engineering)
- Alguns módulos com responsabilidades múltiplas

### 🎯 **Recomendações**
- Considerar quebra de páginas complexas em submódulos
- Implementar lazy loading para reduzir bundle initial
- Documentar padrões arquiteturais
- Monitorar crescimento de dependências

---

> **📊 RESUMO:** Arquitetura sólida e bem estruturada, com dependências organizadas em camadas claras. Sistema maduro com boa separação de concerns e sem problemas estruturais críticos.