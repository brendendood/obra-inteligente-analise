# 📋 INVENTÁRIO - ARQUIVOS COM USO E PAPEL

> **Data do snapshot:** 2025-08-25  
> **Modo:** SAFE MODE - Mapeamento de uso de arquivos  
> **Metodologia:** Análise de imports/exports e referências

## 🎯 ENTRY POINTS (Pontos de Entrada)

### ⚡ **Entry Points Principais**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/main.tsx` | 🚀 **ENTRY_POINT** | Vite (index.html) | Entry point primário da aplicação |
| `src/App.tsx` | 🎮 **APP_ROOT** | main.tsx | Componente raiz com roteamento e providers |
| `index.html` | 📄 **HTML_ROOT** | Vite | Template HTML base |

## 🧩 COMPONENTES DE DOMÍNIO

### 🏠 **Páginas Principais**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/pages/LandingPage.tsx` | 📱 **PAGE** | App.tsx (Route /) | Landing page pública |
| `src/pages/Dashboard.tsx` | 📱 **PAGE** | App.tsx (Route /painel) | Dashboard principal |
| `src/pages/Login.tsx` | 📱 **PAGE** | App.tsx (Route /login) | Página de login |
| `src/pages/Projects.tsx` | 📱 **PAGE** | Deprecated | Lista de projetos (legacy) |
| `src/pages/Upload.tsx` | 📱 **PAGE** | App.tsx (Route /upload) | Upload de arquivos |
| `src/pages/AdminPage.tsx` | 📱 **PAGE** | App.tsx (Route /admin-panel) | Painel administrativo |
| `src/pages/CRMPage.tsx` | 📱 **PAGE** | App.tsx (Route /crm) | CRM dashboard |
| `src/pages/NotFoundPage.tsx` | 📱 **PAGE** | App.tsx (Route *) | Página 404 |

### 🎯 **Páginas de Projeto Específico**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/pages/ProjectSpecificOverview.tsx` | 📱 **PAGE** | App.tsx (Route /projeto/:id) | Overview do projeto |
| `src/pages/ProjectSpecificBudget.tsx` | 📱 **PAGE** | App.tsx (Route /projeto/:id/orcamento) | Orçamento do projeto |
| `src/pages/ProjectSpecificSchedule.tsx` | 📱 **PAGE** | App.tsx (Route /projeto/:id/cronograma) | Cronograma do projeto |
| `src/pages/ProjectSpecificAssistant.tsx` | 📱 **PAGE** | App.tsx (Route /projeto/:id/assistente) | Assistente IA do projeto |
| `src/pages/ProjectSpecificDocumentsPage.tsx` | 📱 **PAGE** | App.tsx (Route /projeto/:id/documentos) | Documentos do projeto |

## 🔄 CONTEXTOS E ESTADO

### 🌐 **Contextos React**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/contexts/AuthProvider.tsx` | 🔐 **CONTEXT** | App.tsx | Provider de autenticação |
| `src/contexts/AuthContext.tsx` | 🔐 **CONTEXT** | AuthProvider.tsx | Contexto de autenticação |
| `src/contexts/ProjectContext.tsx` | 📊 **CONTEXT** | App.tsx | Provider de projetos |
| `src/contexts/ProjectDetailContext.tsx` | 📊 **CONTEXT** | ProjectSpecific pages | Contexto de detalhes do projeto |
| `src/contexts/ImpersonationContext.tsx` | 👤 **CONTEXT** | App.tsx | Contexto de impersonificação |

### 🗃️ **Stores Zustand**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/stores/authStore.ts` | 📦 **STORE** | 15+ hooks | Store de autenticação |
| `src/stores/projectStore.ts` | 📦 **STORE** | Legacy components | Store de projetos (legacy) |
| `src/stores/unifiedProjectStore.ts` | 📦 **STORE** | Dashboard, Projects | Store unificado de projetos |
| `src/stores/adminStore.ts` | 📦 **STORE** | Admin components | Store administrativo |
| `src/stores/crmStore.ts` | 📦 **STORE** | CRM components | Store do CRM |

## 🪝 HOOKS CUSTOMIZADOS

### 🔐 **Hooks de Autenticação**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/hooks/useAuth.ts` | 🪝 **HOOK** | 30+ components | Hook principal de auth |
| `src/hooks/useUserData.ts` | 🪝 **HOOK** | Account components | Dados do usuário |
| `src/hooks/useDefaultAvatar.ts` | 🪝 **HOOK** | Avatar components | Avatar padrão |
| `src/hooks/useEmailSystem.ts` | 🪝 **HOOK** | Admin components | Sistema de email |

### 📊 **Hooks de Projeto**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/hooks/useProjects.ts` | 🪝 **HOOK** | Dashboard, Projects | Gerenciamento de projetos |
| `src/hooks/useProjectSync.ts` | 🪝 **HOOK** | Legacy (removed) | Sincronização de projetos |
| `src/hooks/useProjectDetail.ts` | 🪝 **HOOK** | Project pages | Detalhes do projeto |

### 🛠️ **Hooks Utilitários**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/hooks/use-toast.ts` | 🪝 **HOOK** | 50+ components | Sistema de toast |
| `src/hooks/useCRM.ts` | 🪝 **HOOK** | CRM components | Operações CRM |
| `src/hooks/useAdminAnalytics.ts` | 🪝 **HOOK** | Admin components | Analytics administrativo |

## 🎨 COMPONENTES UI

### 🧱 **Componentes Base (shadcn/ui)**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/components/ui/button.tsx` | 🎨 **UI_COMPONENT** | 100+ components | Componente de botão |
| `src/components/ui/card.tsx` | 🎨 **UI_COMPONENT** | 80+ components | Componente de card |
| `src/components/ui/input.tsx` | 🎨 **UI_COMPONENT** | 60+ components | Componente de input |
| `src/components/ui/dialog.tsx` | 🎨 **UI_COMPONENT** | 40+ components | Componente de diálogo |
| `src/components/ui/table.tsx` | 🎨 **UI_COMPONENT** | 30+ components | Componente de tabela |
| `src/components/ui/toast.tsx` | 🎨 **UI_COMPONENT** | use-toast hook | Sistema de notificações |

### 🏗️ **Componentes Layout**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/components/layout/Sidebar.tsx` | 🏗️ **LAYOUT** | Dashboard, Projects | Sidebar principal |
| `src/components/layout/AppSidebar.tsx` | 🏗️ **LAYOUT** | Re-export | Alias para Sidebar |
| `src/components/layout/Header.tsx` | 🏗️ **LAYOUT** | Pages | Header da aplicação |

### 🔐 **Componentes de Auth**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/components/auth/ProtectedRoute.tsx` | 🔐 **AUTH_GUARD** | App.tsx (20+ routes) | Proteção de rotas |
| `src/components/auth/LoginForm.tsx` | 🔐 **AUTH_UI** | Login page | Formulário de login |
| `src/components/auth/SignupForm.tsx` | 🔐 **AUTH_UI** | Signup page | Formulário de cadastro |

## 🔌 INTEGRAÇÕES E SERVIÇOS

### 🗄️ **Supabase Integration**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/integrations/supabase/client.ts` | 🔌 **INTEGRATION** | 100+ files | Cliente Supabase |
| `src/integrations/supabase/types.ts` | 🔌 **TYPES** | 50+ files | Tipos do banco |

### 🤖 **Sistema de Agentes IA**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/utils/agents/agentService.ts` | 🤖 **SERVICE** | AI components | Serviço de agentes |
| `src/utils/agents/agentConfig.ts` | 🤖 **CONFIG** | agentService.ts | Configuração dos agentes |
| `src/utils/agents/agentTypes.ts` | 🤖 **TYPES** | Agent files | Tipos dos agentes |

### 📁 **Fallbacks de IA**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/utils/agents/fallbacks/generalFallback.ts` | 🤖 **FALLBACK** | agentConfig.ts | Fallback geral |
| `src/utils/agents/fallbacks/projectFallback.ts` | 🤖 **FALLBACK** | agentConfig.ts | Fallback de projeto |
| `src/utils/agents/fallbacks/budgetFallback.ts` | 🤖 **FALLBACK** | agentConfig.ts | Fallback de orçamento |
| `src/utils/agents/fallbacks/scheduleFallback.ts` | 🤖 **FALLBACK** | agentConfig.ts | Fallback de cronograma |
| `src/utils/agents/fallbacks/analysisFallback.ts` | 🤖 **FALLBACK** | agentConfig.ts | Fallback de análise |

## 🛠️ UTILITÁRIOS E LIBS

### 📚 **Bibliotecas Core**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/lib/utils.ts` | 📚 **LIB** | 100+ components | Utilitários gerais (cn, etc) |
| `src/lib/auth.ts` | 📚 **LIB** | Auth components | Utilitários de auth |
| `src/lib/constants.ts` | 📚 **LIB** | Various components | Constantes globais |
| `src/lib/validations.ts` | 📚 **LIB** | Form components | Validações de formulário |

### 📊 **Utilitários de Exportação**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/utils/pdf.ts` | 🔧 **UTILITY** | Export components | Geração de PDF |
| `src/utils/adminExportUtils.ts` | 🔧 **UTILITY** | Admin components | Exportação admin |

### 📁 **Utilitários de Upload**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/utils/upload/fileValidation.ts` | 🔧 **UTILITY** | Upload components | Validação de arquivos |
| `src/utils/upload/uploadUtils.ts` | 🔧 **UTILITY** | Upload components | Utilitários de upload |

## 🧪 CONFIGURAÇÃO E INFRAESTRUTURA

### ⚙️ **Configuração de Build**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `vite.config.ts` | ⚙️ **BUILD_CONFIG** | Vite | Configuração do Vite |
| `tailwind.config.ts` | ⚙️ **STYLE_CONFIG** | PostCSS | Configuração Tailwind |
| `tsconfig.json` | ⚙️ **TYPE_CONFIG** | TypeScript | Configuração TS |
| `eslint.config.js` | ⚙️ **LINT_CONFIG** | ESLint | Configuração ESLint |

### 🎨 **Estilos Globais**
| Arquivo | Papel | Importado por | Descrição |
|---------|-------|---------------|-----------|
| `src/index.css` | 🎨 **GLOBAL_STYLES** | main.tsx | Estilos globais |
| `src/App.css` | 🎨 **APP_STYLES** | App.tsx | Estilos da aplicação |

## 📊 ESTATÍSTICAS DE USO

### 🔥 **Arquivos Mais Importados**
1. `src/lib/utils.ts` - 100+ importações
2. `src/integrations/supabase/client.ts` - 80+ importações  
3. `src/hooks/useAuth.ts` - 50+ importações
4. `src/components/ui/button.tsx` - 100+ importações
5. `src/components/ui/card.tsx` - 80+ importações

### 📈 **Distribuição por Tipo**
- **UI Components:** 60+ arquivos
- **Pages:** 15+ arquivos  
- **Hooks:** 30+ arquivos
- **Utilities:** 20+ arquivos
- **Types/Configs:** 15+ arquivos

---

> **📋 RESUMO:** Sistema bem estruturado com clara separação de responsabilidades. Componentes UI são altamente reutilizados, hooks seguem padrões consistentes, e a arquitetura favorece a manutenibilidade.