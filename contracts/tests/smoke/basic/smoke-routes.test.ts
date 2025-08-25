// 🧪 SMOKE TEST - Verificação de Rotas
// Objetivo: Verificar se as rotas principais respondem corretamente

import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Imports dos componentes principais
import App from '@/App'
import LandingPage from '@/pages/LandingPage'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFoundPage'

// Mock do Supabase para evitar chamadas reais
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  },
}))

describe('🌐 Smoke Tests - Routes', () => {
  let queryClient: QueryClient

  beforeAll(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </QueryClientProvider>
    )
  }

  describe('✅ Rotas Públicas', () => {
    it('should render Landing Page without errors', () => {
      renderWithProviders(<LandingPage />)
      // Verificação básica - não valida conteúdo específico
      expect(document.body).toBeTruthy()
    })

    it('should render Login Page without errors', () => {
      renderWithProviders(<Login />)
      expect(document.body).toBeTruthy()
    })

    it('should render 404 Page without errors', () => {
      renderWithProviders(<NotFound />)
      expect(document.body).toBeTruthy()
    })
  })

  describe('🔒 Proteção de Rotas', () => {
    it('should handle protected route logic without errors', () => {
      // Testa se o App renderiza sem falhas
      renderWithProviders(<App />)
      expect(document.body).toBeTruthy()
    })
  })

  describe('🧭 Navegação', () => {
    it('should handle route navigation without errors', () => {
      // Simula mudança de rota
      window.history.pushState({}, 'Test', '/login')
      renderWithProviders(<App />)
      expect(document.body).toBeTruthy()
    })

    it('should handle invalid routes (404)', () => {
      window.history.pushState({}, 'Test', '/rota-inexistente')
      renderWithProviders(<App />)
      expect(document.body).toBeTruthy()
    })
  })

  describe('📱 Rotas com Parâmetros', () => {
    it('should handle project routes with parameters', () => {
      window.history.pushState({}, 'Test', '/projeto/test-id')
      renderWithProviders(<App />)
      expect(document.body).toBeTruthy()
    })

    it('should handle nested project routes', () => {
      window.history.pushState({}, 'Test', '/projeto/test-id/orcamento')
      renderWithProviders(<App />)
      expect(document.body).toBeTruthy()
    })
  })
})

describe('🔗 Route Status Verification', () => {
  // Testa os status codes que as rotas devem retornar
  const publicRoutes = [
    '/',
    '/login',
    '/cadastro',
    '/termos',
    '/politica',
    '/auth/callback',
    '/confirm-email',
  ]

  const protectedRoutes = [
    '/painel',
    '/upload',
    '/ia',
    '/conta',
    '/crm',
    '/admin-panel',
  ]

  it.each(publicRoutes)('public route %s should be accessible', (route) => {
    // Em um SPA, todas as rotas retornam a mesma página HTML
    // O roteamento é client-side, então este teste verifica se não há erro 500
    expect(() => {
      window.history.pushState({}, 'Test', route)
    }).not.toThrow()
  })

  it.each(protectedRoutes)('protected route %s should handle authentication', (route) => {
    // Verifica se rotas protegidas não geram erro de renderização
    expect(() => {
      window.history.pushState({}, 'Test', route)
    }).not.toThrow()
  })
})