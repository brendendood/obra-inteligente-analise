// 🧪 SMOKE TEST - Verificação de Imports
// Objetivo: Verificar se os módulos principais podem ser importados sem erros

import { describe, it, expect } from 'vitest'

describe('📦 Smoke Tests - Imports', () => {
  describe('🚀 Entry Points', () => {
    it('should import App component', async () => {
      const module = await import('@/App')
      expect(module.default).toBeDefined()
      expect(typeof module.default).toBe('function')
    })
  })

  describe('🔐 Authentication Modules', () => {
    it('should import AuthProvider', async () => {
      const module = await import('@/contexts/AuthProvider')
      expect(module.AuthProvider).toBeDefined()
    })

    it('should import AuthContext', async () => {
      const module = await import('@/contexts/AuthContext')
      expect(module.AuthContext).toBeDefined()
    })

    it('should import useAuth hook', async () => {
      const module = await import('@/hooks/useAuth')
      expect(module.useAuth).toBeDefined()
      expect(typeof module.useAuth).toBe('function')
    })

    it('should import authStore', async () => {
      const module = await import('@/stores/authStore')
      expect(module.authStore).toBeDefined()
    })
  })

  describe('📊 Project Management', () => {
    it('should import ProjectContext', async () => {
      const module = await import('@/contexts/ProjectContext')
      expect(module.ProjectProvider).toBeDefined()
    })

    it('should import ProjectDetailContext', async () => {
      const module = await import('@/contexts/ProjectDetailContext')
      expect(module.ProjectDetailProvider).toBeDefined()
      expect(module.useProjectDetail).toBeDefined()
    })

    it('should import unifiedProjectStore', async () => {
      const module = await import('@/stores/unifiedProjectStore')
      expect(module.useUnifiedProjectStore).toBeDefined()
    })

    it('should import useProjects hook', async () => {
      const module = await import('@/hooks/useProjects')
      expect(module.useProjects).toBeDefined()
      expect(typeof module.useProjects).toBe('function')
    })
  })

  describe('🎨 UI Components', () => {
    it('should import Button component', async () => {
      const module = await import('@/components/ui/button')
      expect(module.Button).toBeDefined()
      expect(module.buttonVariants).toBeDefined()
    })

    it('should import Card components', async () => {
      const module = await import('@/components/ui/card')
      expect(module.Card).toBeDefined()
      expect(module.CardHeader).toBeDefined()
      expect(module.CardContent).toBeDefined()
      expect(module.CardTitle).toBeDefined()
    })

    it('should import Input component', async () => {
      const module = await import('@/components/ui/input')
      expect(module.Input).toBeDefined()
    })

    it('should import Dialog components', async () => {
      const module = await import('@/components/ui/dialog')
      expect(module.Dialog).toBeDefined()
      expect(module.DialogContent).toBeDefined()
      expect(module.DialogHeader).toBeDefined()
    })

    it('should import Table components', async () => {
      const module = await import('@/components/ui/table')
      expect(module.Table).toBeDefined()
      expect(module.TableBody).toBeDefined()
      expect(module.TableHead).toBeDefined()
      expect(module.TableRow).toBeDefined()
      expect(module.TableCell).toBeDefined()
    })
  })

  describe('🔌 Integrations', () => {
    it('should import Supabase client', async () => {
      const module = await import('@/integrations/supabase/client')
      expect(module.supabase).toBeDefined()
      expect(module.supabase.auth).toBeDefined()
      expect(module.supabase.from).toBeDefined()
    })

    it('should import Supabase types', async () => {
      const module = await import('@/integrations/supabase/types')
      expect(module).toBeDefined()
      // Types são interfaces, então verificamos se o módulo não é vazio
      expect(Object.keys(module).length).toBeGreaterThan(0)
    })
  })

  describe('🤖 AI Agent System', () => {
    it('should import AgentService', async () => {
      const module = await import('@/utils/agents/agentService')
      expect(module.AgentService).toBeDefined()
    })

    it('should import agent configuration', async () => {
      const module = await import('@/utils/agents/agentConfig')
      expect(module.AGENT_CONFIGS).toBeDefined()
      expect(typeof module.AGENT_CONFIGS).toBe('object')
    })

    it('should import agent types', async () => {
      const module = await import('@/utils/agents/agentTypes')
      expect(module).toBeDefined()
    })

    it('should import fallback functions', async () => {
      const generalFallback = await import('@/utils/agents/fallbacks/generalFallback')
      expect(generalFallback.getGeneralFallback).toBeDefined()

      const projectFallback = await import('@/utils/agents/fallbacks/projectFallback')
      expect(projectFallback.getProjectFallback).toBeDefined()

      const budgetFallback = await import('@/utils/agents/fallbacks/budgetFallback')
      expect(budgetFallback.getBudgetFallback).toBeDefined()
    })
  })

  describe('📚 Utilities', () => {
    it('should import lib/utils', async () => {
      const module = await import('@/lib/utils')
      expect(module.cn).toBeDefined()
      expect(typeof module.cn).toBe('function')
    })

    it('should import auth utilities', async () => {
      const module = await import('@/lib/auth')
      expect(module).toBeDefined()
    })

    it('should import use-toast', async () => {
      const module = await import('@/hooks/use-toast')
      expect(module.useToast).toBeDefined()
      expect(module.toast).toBeDefined()
      expect(typeof module.useToast).toBe('function')
    })
  })

  describe('📄 Pages', () => {
    it('should import main pages', async () => {
      const landingPage = await import('@/pages/LandingPage')
      expect(landingPage.default).toBeDefined()

      const dashboard = await import('@/pages/Dashboard')
      expect(dashboard.default).toBeDefined()

      const login = await import('@/pages/Login')
      expect(login.default).toBeDefined()

      const upload = await import('@/pages/Upload')
      expect(upload.default).toBeDefined()
    })

    it('should import project specific pages', async () => {
      const overview = await import('@/pages/ProjectSpecificOverview')
      expect(overview.default).toBeDefined()

      const budget = await import('@/pages/ProjectSpecificBudget')
      expect(budget.default).toBeDefined()

      const schedule = await import('@/pages/ProjectSpecificSchedule')
      expect(schedule.default).toBeDefined()

      const assistant = await import('@/pages/ProjectSpecificAssistant')
      expect(assistant.default).toBeDefined()
    })

    it('should import admin pages', async () => {
      const adminPage = await import('@/pages/AdminPage')
      expect(adminPage.default).toBeDefined()

      const crmPage = await import('@/pages/CRMPage')
      expect(crmPage.default).toBeDefined()
    })
  })

  describe('🗃️ Stores', () => {
    it('should import all Zustand stores', async () => {
      const authStore = await import('@/stores/authStore')
      expect(authStore.authStore).toBeDefined()

      const projectStore = await import('@/stores/unifiedProjectStore')
      expect(projectStore.useUnifiedProjectStore).toBeDefined()

      const adminStore = await import('@/stores/adminStore')
      expect(adminStore.useAdminStore).toBeDefined()

      const crmStore = await import('@/stores/crmStore')
      expect(crmStore.useCRMStore).toBeDefined()
    })
  })

  describe('🪝 Custom Hooks', () => {
    it('should import authentication hooks', async () => {
      const useAuth = await import('@/hooks/useAuth')
      expect(useAuth.useAuth).toBeDefined()

      const useUserData = await import('@/hooks/useUserData')
      expect(useUserData.useUserData).toBeDefined()
    })

    it('should import project hooks', async () => {
      const useProjects = await import('@/hooks/useProjects')
      expect(useProjects.useProjects).toBeDefined()
    })

    it('should import admin hooks', async () => {
      const useAdminAnalytics = await import('@/hooks/useAdminAnalytics')
      expect(useAdminAnalytics.useAdminAnalytics).toBeDefined()
    })

    it('should import CRM hooks', async () => {
      const useCRM = await import('@/hooks/use-crm')
      expect(useCRM.useCRM).toBeDefined()
    })
  })
})

describe('⚡ Import Performance', () => {
  it('should import critical modules within reasonable time', async () => {
    const start = performance.now()
    
    await Promise.all([
      import('@/App'),
      import('@/lib/utils'),
      import('@/integrations/supabase/client'),
      import('@/hooks/useAuth'),
      import('@/stores/authStore'),
    ])
    
    const end = performance.now()
    const importTime = end - start
    
    // Imports should complete within 1 second (generous threshold)
    expect(importTime).toBeLessThan(1000)
  })
})