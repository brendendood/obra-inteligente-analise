# ✅ REGRAS DE INCLUSÃO - FONTE DE VERDADE

> **Data:** 2025-08-25  
> **Modo:** SAFE MODE - Definição de padrões arquiteturais  
> **Objetivo:** Estabelecer diretrizes para futuras implementações

## 🎯 PRINCÍPIOS FUNDAMENTAIS

### 🏗️ **Arquitetura Aprovada**
1. **SPA React** com roteamento client-side
2. **Supabase backend** para dados e autenticação
3. **Zustand stores** para estado global
4. **shadcn/ui** para componentes de interface
5. **React Query** para estado de servidor
6. **TypeScript strict** em 100% do código

### 📁 **Estrutura de Pastas Padrão**
```
src/
├── components/         # ✅ Componentes reutilizáveis
├── contexts/          # ✅ Contextos React (usar com moderação)
├── hooks/             # ✅ Hooks customizados
├── integrations/      # ✅ Integrações externas (Supabase)
├── lib/               # ✅ Utilitários e configurações
├── pages/             # ✅ Componentes de página/rota
├── stores/            # ✅ Estado global (Zustand)
├── utils/             # ✅ Funções utilitárias específicas
├── App.tsx            # ✅ Componente raiz
├── main.tsx           # ✅ Entry point
└── index.css          # ✅ Estilos globais
```

## ✅ FONTES DE VERDADE OFICIAIS

### 🔐 **Sistema de Autenticação**
```typescript
🎯 USAR:
├── src/contexts/AuthProvider.tsx      # Provider principal
├── src/contexts/AuthContext.tsx       # Contexto de auth
├── src/hooks/useAuth.ts               # Hook principal
├── src/stores/authStore.ts            # Estado global
└── src/integrations/supabase/client.ts # Cliente Supabase

❌ NÃO USAR:
├── Implementações customizadas de JWT
├── Bibliotecas de auth alternativas
└── Auth state em localStorage manual
```

### 📊 **Gerenciamento de Projetos**
```typescript
🎯 USAR:
├── src/stores/unifiedProjectStore.ts     # ✅ FONTE DE VERDADE
├── src/hooks/useProjects.ts              # Hook principal
├── src/contexts/ProjectDetailContext.tsx # Para detalhes específicos
└── src/pages/Dashboard.tsx               # Interface principal

❌ NÃO USAR:
├── src/stores/projectStore.ts            # Legacy - descontinuado
├── src/pages/Projects.tsx                # Legacy - substituído
└── Implementações duplicadas
```

### 🎨 **Sistema de UI/Design**
```typescript
🎯 USAR:
├── src/components/ui/                 # shadcn/ui components
├── src/lib/utils.ts                   # Utilitário cn() e helpers
├── src/index.css                      # Design tokens globais
├── tailwind.config.ts                 # Configuração Tailwind
└── components.json                    # Configuração shadcn/ui

❌ NÃO USAR:
├── CSS modules personalizados
├── Styled-components
├── Bibliotecas de UI alternativas
└── Estilos inline extensivos
```

### 🌐 **Roteamento e Navegação**
```typescript
🎯 USAR:
├── src/App.tsx                        # Definição de rotas principais
├── react-router-dom                   # Biblioteca oficial
├── src/components/auth/ProtectedRoute.tsx # Proteção de rotas
└── Estrutura /projeto/:id/*           # Padrão para rotas dinâmicas

❌ NÃO USAR:
├── Next.js router (projeto é Vite)
├── Roteamento manual
├── Bibliotecas de routing alternativas
└── Estrutura src/app/ (template Next.js)
```

## 📦 PADRÕES DE MÓDULOS

### 🗃️ **Estado Global (Zustand)**
```typescript
🎯 PADRÃO APROVADO:
// src/stores/exampleStore.ts
interface ExampleStore {
  data: DataType[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchData: () => Promise<void>;
  createItem: (item: CreateDataType) => Promise<void>;
  updateItem: (id: string, data: UpdateDataType) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // Setters
  setData: (data: DataType[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useExampleStore = create<ExampleStore>((set, get) => ({
  // Implementation...
}))
```

### 🪝 **Hooks Customizados**
```typescript
🎯 PADRÃO APROVADO:
// src/hooks/useExample.ts
interface UseExampleReturn {
  data: DataType[];
  loading: boolean;
  error: string | null;
  actions: {
    create: (item: CreateDataType) => Promise<void>;
    update: (id: string, data: UpdateDataType) => Promise<void>;
    delete: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
  };
}

export function useExample(): UseExampleReturn {
  // Implementation using stores + React Query
}
```

### 🧩 **Componentes React**
```typescript
🎯 PADRÃO APROVADO:
// src/components/domain/ExampleComponent.tsx
interface ExampleComponentProps {
  data: DataType;
  onAction?: (data: DataType) => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function ExampleComponent({ 
  data, 
  onAction, 
  variant = 'default',
  className 
}: ExampleComponentProps) {
  // Implementation...
}
```

## 🔌 INTEGRAÇÕES APROVADAS

### 🗄️ **Banco de Dados**
```typescript
🎯 USAR:
├── src/integrations/supabase/client.ts    # Cliente único
├── src/integrations/supabase/types.ts     # Tipos gerados
├── Row Level Security (RLS)               # Segurança
├── Real-time subscriptions                # Updates automáticos
└── Edge Functions para lógica complexa    # Serverless

❌ NÃO USAR:
├── Múltiplos clientes Supabase
├── Conexões diretas ao PostgreSQL
├── ORMs alternativos
└── APIs REST customizadas
```

### 🤖 **Sistema de IA**
```typescript
🎯 USAR:
├── src/utils/agents/agentService.ts       # Serviço principal
├── src/utils/agents/agentConfig.ts        # Configurações
├── src/utils/agents/agentTypes.ts         # Tipos TypeScript
├── src/utils/agents/fallbacks/           # Fallbacks por tipo
└── N8N webhooks via HTTPS                # Integração externa

❌ NÃO USAR:
├── OpenAI SDK direto no frontend
├── APIs de IA alternativas sem fallback
├── Lógica de IA no frontend
└── Tokens de API expostos
```

### 📁 **Upload e Storage**
```typescript
🎯 USAR:
├── Supabase Storage buckets              # Storage principal
├── react-dropzone                       # UI de upload
├── src/utils/upload/                     # Utilitários
├── RLS policies para segurança          # Controle de acesso
└── Validação de tipos/tamanhos          # Segurança

❌ NÃO USAR:
├── Upload direto para S3/outros
├── Armazenamento local extensivo
├── Bibliotecas de upload alternativas
└── Upload sem validação
```

## 📋 PADRÕES DE NOMENCLATURA

### 📁 **Arquivos e Pastas**
```
🎯 PADRÃO APROVADO:
├── PascalCase para componentes: UserProfile.tsx
├── camelCase para hooks: useUserData.ts
├── camelCase para stores: userStore.ts
├── camelCase para utils: formatDate.ts
├── kebab-case para UI components: input-otp.tsx
└── UPPER_CASE para constants: API_ENDPOINTS.ts
```

### 🔤 **Variáveis e Funções**
```typescript
🎯 PADRÃO APROVADO:
// Interfaces
interface UserProfile extends BaseProfile

// Components
export function UserProfileCard()

// Hooks
export function useUserProfile()

// Stores
export const useUserStore = create<UserStore>()

// Constants
export const API_ENDPOINTS = {
  USERS: '/api/users',
  PROJECTS: '/api/projects'
} as const

// Types
export type UserStatus = 'active' | 'inactive' | 'pending'
```

## 🔄 FLUXOS APROVADOS

### 📊 **Fluxo de Dados**
```
🎯 FLUXO PADRÃO:
User Action → Component → Hook → Store → Supabase → Real-time Update → Store → Component → UI Update

❌ EVITAR:
User Action → Component → Direct API → Component State (sem store)
User Action → Multiple Stores → Conflicting States
```

### 🔐 **Fluxo de Autenticação**
```
🎯 FLUXO PADRÃO:
Login → AuthProvider → AuthContext → authStore → Supabase Auth → Session → Protected Routes

❌ EVITAR:
Login → Direct localStorage → Manual session management
Multiple auth providers → Conflicting states
```

### 🚀 **Fluxo de Deploy**
```
🎯 FLUXO PADRÃO:
Code → TypeScript Check → ESLint → Build → Lovable Deploy → Production

❌ EVITAR:
Code → Direct deploy (sem checks)
Manual deploy processes
Multiple deploy targets
```

## 🧪 TESTES APROVADOS

### 🔍 **Estratégia de Testes**
```typescript
🎯 USAR:
├── Vitest para unit tests               # Framework principal
├── @testing-library/react              # Testing utilities
├── Smoke tests para integração         # Verificações básicas
├── TypeScript para type safety         # Prevenção de bugs
└── ESLint para code quality            # Qualidade de código

❌ NÃO USAR:
├── Jest (conflita com Vite)
├── Enzyme (deprecated)
├── Cypress sem smoke tests
└── Testes E2E complexos sem base
```

## 📈 MÉTRICAS E QUALIDADE

### 📊 **Indicadores Aprovados**
```
🎯 MANTER:
├── TypeScript strict: 100%
├── ESLint errors: 0
├── Build success rate: 100%
├── Smoke test pass rate: 100%
└── Bundle size: < 1MB initial

⚠️ MONITORAR:
├── Component re-renders
├── API response times
├── Error boundaries triggered
├── Console errors/warnings
└── Memory leaks
```

## 🔒 SEGURANÇA APROVADA

### 🛡️ **Práticas Obrigatórias**
```
🎯 IMPLEMENTAR:
├── RLS em todas as tabelas Supabase
├── Validação no frontend E backend
├── Sanitização de dados (DOMPurify)
├── HTTPS obrigatório
├── JWT tokens seguros
├── Upload validation
└── Error boundaries

❌ NUNCA:
├── Tokens/secrets no frontend
├── SQL queries diretas
├── innerHTML sem sanitização
├── localStorage para dados sensíveis
├── HTTP em produção
└── Validação só no frontend
```

---

## 🎯 RESUMO EXECUTIVO

### ✅ **SEMPRE USAR**
1. **unifiedProjectStore** para projetos
2. **shadcn/ui** para componentes
3. **Supabase** para backend
4. **TypeScript strict** em tudo
5. **React Query** para server state
6. **Zustand** para client state

### ❌ **NUNCA USAR**
1. **projectStore** legacy
2. **Páginas Projects** antigas
3. **Hooks removidos** (useProjectSync, etc.)
4. **Diretório src/app/** template
5. **CSS-in-JS** alternativo
6. **APIs REST** customizadas

### ⚠️ **VERIFICAR ANTES**
1. **Componentes suspeitos** da lista
2. **Utilitários não testados**
3. **Integrações externas** novas
4. **Mudanças de arquitetura**

---

> **🎯 OBJETIVO:** Manter consistência, qualidade e manutenibilidade através de padrões claros e testados. Em caso de dúvida, prefira simplicidade e padrões existentes a inovações não testadas.