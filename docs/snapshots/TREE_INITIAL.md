# 🌳 SNAPSHOT INICIAL - ÁRVORE DE DIRETÓRIOS

> **Data do snapshot:** 2025-08-25  
> **Modo:** SAFE MODE - Somente leitura  
> **Exclusões:** node_modules, build artifacts, cache

## 📂 ESTRUTURA COMPLETA

```
📦 MadenAI/
├── 📁 .vscode/
├── 📁 docs/                           # 📚 Documentação (criada em SAFE MODE)
│   ├── 📁 snapshots/
│   │   ├── TREE_INITIAL.md
│   │   ├── ENTRYPOINTS.md
│   │   └── TOOLING.md
│   └── SAFE_MODE.md
├── 📁 public/
│   ├── favicon.ico
│   └── placeholder.svg
├── 📁 src/                            # 🎯 Código fonte principal
│   ├── 📁 components/                 # 🧩 Componentes React
│   │   ├── 📁 auth/
│   │   ├── 📁 layout/
│   │   ├── 📁 ui/                     # 🎨 Componentes UI (shadcn/ui)
│   │   ├── 📁 admin/
│   │   ├── 📁 dashboard/
│   │   ├── 📁 projects/
│   │   ├── 📁 budget/
│   │   ├── 📁 schedule/
│   │   ├── 📁 documents/
│   │   ├── 📁 crm/
│   │   └── 📁 ai/
│   ├── 📁 contexts/                   # 🔄 Contextos React
│   │   ├── AuthContext.tsx
│   │   ├── ProjectContext.tsx
│   │   └── ProjectDetailContext.tsx
│   ├── 📁 hooks/                      # 🪝 Custom Hooks
│   │   ├── 📁 auth/
│   │   ├── 📁 projects/
│   │   ├── 📁 admin/
│   │   ├── 📁 budget/
│   │   ├── 📁 schedule/
│   │   ├── 📁 crm/
│   │   └── 📁 ai/
│   ├── 📁 integrations/               # 🔌 Integrações externas
│   │   └── 📁 supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── 📁 lib/                        # 📚 Bibliotecas e utilitários
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   ├── constants.ts
│   │   └── auth.ts
│   ├── 📁 pages/                      # 📄 Páginas principais
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   ├── Upload.tsx
│   │   ├── AdminPage.tsx
│   │   ├── CRMPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── 📁 stores/                     # 🗃️ Estado global (Zustand)
│   │   ├── authStore.ts
│   │   ├── projectStore.ts
│   │   ├── unifiedProjectStore.ts
│   │   ├── adminStore.ts
│   │   └── crmStore.ts
│   ├── 📁 utils/                      # 🛠️ Utilitários
│   │   ├── 📁 agents/                 # 🤖 Sistema de agentes IA
│   │   │   ├── 📁 fallbacks/
│   │   │   ├── agentTypes.ts
│   │   │   ├── agentConfig.ts
│   │   │   └── agentService.ts
│   │   ├── 📁 export/
│   │   ├── 📁 upload/
│   │   └── 📁 validation/
│   ├── App.tsx                        # 🚀 Componente raiz
│   ├── main.tsx                       # ⚡ Entry point
│   ├── index.css                      # 🎨 Estilos globais
│   └── vite-env.d.ts
├── 📁 supabase/                       # 🗄️ Configuração do banco
│   ├── 📁 migrations/
│   └── config.toml
├── .env                               # 🔐 Variáveis de ambiente
├── .gitignore
├── CHECKLIST_CORRECOES_FINAIS.md      # ✅ Log de correções
├── README.md
├── bun.lockb
├── components.json                    # 🎨 Configuração shadcn/ui
├── eslint.config.js                  # 📏 Configuração ESLint
├── index.html
├── package.json                       # 📦 Dependências e scripts
├── package-lock.json
├── postcss.config.js                 # 🎨 PostCSS
├── tailwind.config.ts                # 🎨 Tailwind CSS
├── tsconfig.app.json                 # 📝 TypeScript (app)
├── tsconfig.json                     # 📝 TypeScript (raiz)
├── tsconfig.node.json                # 📝 TypeScript (Node)
└── vite.config.ts                    # ⚡ Configuração Vite
```

## 📊 ESTATÍSTICAS DO PROJETO

### 📁 **DISTRIBUIÇÃO DE ARQUIVOS**
- **Componentes React:** ~150+ arquivos em `/src/components/`
- **Páginas principais:** 9 páginas em `/src/pages/`
- **Hooks customizados:** ~40+ hooks em `/src/hooks/`
- **Stores Zustand:** 5 stores em `/src/stores/`
- **Contextos React:** 3 contextos em `/src/contexts/`
- **Utilitários:** Múltiplos módulos em `/src/utils/`
- **Configurações:** 8+ arquivos de config na raiz

### 🎯 **PONTOS DE ENTRADA IDENTIFICADOS**
- **Main:** `src/main.tsx` (Vite entry point)
- **App:** `src/App.tsx` (React root)
- **Landing:** `src/pages/LandingPage.tsx`
- **Dashboard:** `src/pages/Dashboard.tsx`
- **Auth:** `src/contexts/AuthContext.tsx`

### 🔗 **INTEGRAÇÕES PRINCIPAIS**
- **Supabase:** Base de dados e auth (`src/integrations/supabase/`)
- **N8N:** Webhooks IA (`src/utils/agents/`)
- **shadcn/ui:** Componentes UI (`src/components/ui/`)
- **Zustand:** Estado global (`src/stores/`)

---

> **⚠️ IMPORTANTE:** Este snapshot representa o estado **inicial** antes de qualquer implementação em MODO SEGURO. Serve como linha de base para garantir que nenhum arquivo de runtime seja modificado durante atividades organizacionais.