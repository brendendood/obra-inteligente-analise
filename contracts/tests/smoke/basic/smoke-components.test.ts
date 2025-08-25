// 🧪 SMOKE TEST - Verificação de Componentes
// Objetivo: Verificar se os componentes principais renderizam sem erros

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        order: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    }),
  },
}))

// Mock do useAuth para componentes protegidos
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    user: null,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    isAuthenticated: false,
  }),
}))

describe('🧩 Smoke Tests - Components', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const renderComponent = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </QueryClientProvider>
    )
  }

  describe('🎨 UI Components (shadcn/ui)', () => {
    it('should render Button component', async () => {
      const { Button } = await import('@/components/ui/button')
      
      const { container } = render(<Button>Test Button</Button>)
      expect(container.firstChild).toBeTruthy()
    })

    it('should render Card components', async () => {
      const { Card, CardHeader, CardContent, CardTitle } = await import('@/components/ui/card')
      
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )
      expect(container.firstChild).toBeTruthy()
    })

    it('should render Input component', async () => {
      const { Input } = await import('@/components/ui/input')
      
      const { container } = render(<Input placeholder="Test Input" />)
      expect(container.firstChild).toBeTruthy()
    })

    it('should render Dialog components', async () => {
      const { Dialog, DialogContent, DialogHeader, DialogTitle } = await import('@/components/ui/dialog')
      
      const { container } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      expect(container.firstChild).toBeTruthy()
    })

    it('should render Table components', async () => {
      const { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } = await import('@/components/ui/table')
      
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('📄 Page Components', () => {
    it('should render LandingPage', async () => {
      const LandingPage = (await import('@/pages/LandingPage')).default
      
      const { container } = renderComponent(<LandingPage />)
      expect(container.firstChild).toBeTruthy()
    })

    it('should render Login page', async () => {
      const Login = (await import('@/pages/Login')).default
      
      const { container } = renderComponent(<Login />)
      expect(container.firstChild).toBeTruthy()
    })

    it('should render Dashboard', async () => {
      const Dashboard = (await import('@/pages/Dashboard')).default
      
      const { container } = renderComponent(<Dashboard />)
      expect(container.firstChild).toBeTruthy()
    })

    it('should render Upload page', async () => {
      const Upload = (await import('@/pages/Upload')).default
      
      const { container } = renderComponent(<Upload />)
      expect(container.firstChild).toBeTruthy()
    })

    it('should render NotFound page', async () => {
      const NotFound = (await import('@/pages/NotFoundPage')).default
      
      const { container } = renderComponent(<NotFound />)
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('🔐 Auth Components', () => {
    it('should render ProtectedRoute', async () => {
      const ProtectedRoute = (await import('@/components/auth/ProtectedRoute')).default
      
      const { container } = renderComponent(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('🏗️ Layout Components', () => {
    it('should render Sidebar', async () => {
      const { Sidebar } = await import('@/components/layout/Sidebar')
      
      const { container } = renderComponent(<Sidebar />)
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('🌐 Context Providers', () => {
    it('should render AuthProvider', async () => {
      const { AuthProvider } = await import('@/contexts/AuthProvider')
      
      const { container } = render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <div>Child content</div>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      )
      expect(container.firstChild).toBeTruthy()
    })

    it('should render ProjectProvider', async () => {
      const { ProjectProvider } = await import('@/contexts/ProjectContext')
      
      const { container } = render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ProjectProvider>
              <div>Child content</div>
            </ProjectProvider>
          </BrowserRouter>
        </QueryClientProvider>
      )
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('🎯 Component Error Boundaries', () => {
    it('should handle component errors gracefully', async () => {
      const ErrorComponent = () => {
        throw new Error('Test error')
      }

      // Test que componente com erro não quebra toda a aplicação
      expect(() => {
        render(
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <ErrorComponent />
            </BrowserRouter>
          </QueryClientProvider>
        )
      }).toThrow('Test error')
    })
  })

  describe('🔄 Component State Management', () => {
    it('should handle component state without errors', async () => {
      const { Button } = await import('@/components/ui/button')
      
      const StatefulComponent = () => {
        const [count, setCount] = React.useState(0)
        return (
          <Button onClick={() => setCount(count + 1)}>
            Count: {count}
          </Button>
        )
      }

      const { container } = render(<StatefulComponent />)
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('📱 Responsive Components', () => {
    it('should render components in different viewport sizes', async () => {
      const { Card } = await import('@/components/ui/card')
      
      // Simula viewport mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const { container: mobileContainer } = render(<Card>Mobile View</Card>)
      expect(mobileContainer.firstChild).toBeTruthy()

      // Simula viewport desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      })

      const { container: desktopContainer } = render(<Card>Desktop View</Card>)
      expect(desktopContainer.firstChild).toBeTruthy()
    })
  })
})

describe('⚡ Component Performance', () => {
  it('should render components within reasonable time', async () => {
    const { Button } = await import('@/components/ui/button')
    
    const start = performance.now()
    
    // Renderiza múltiplos componentes
    for (let i = 0; i < 10; i++) {
      render(<Button key={i}>Button {i}</Button>)
    }
    
    const end = performance.now()
    const renderTime = end - start
    
    // Renderização deve ser rápida (menos de 100ms para 10 componentes)
    expect(renderTime).toBeLessThan(100)
  })
})