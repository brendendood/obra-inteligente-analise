
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { LazyWrapper } from "@/components/ui/lazy-wrapper";
import { PageConstructionLoading } from "@/components/ui/construction-loading";

// Páginas críticas (carregadas imediatamente)
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Páginas com lazy loading
const Upload = lazy(() => import("./pages/Upload"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Account = lazy(() => import("./pages/Account"));
const Plan = lazy(() => import("./pages/Plan"));
const Help = lazy(() => import("./pages/Help"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Layout e páginas do projeto específico (lazy loading)
const ProjectSpecificLayout = lazy(() => import("./pages/project-specific/layout"));
const ProjectSpecificOverview = lazy(() => import("./pages/project-specific/overview"));
const ProjectSpecificBudget = lazy(() => import("./pages/project-specific/budget"));
const ProjectSpecificSchedule = lazy(() => import("./pages/project-specific/schedule"));
const ProjectSpecificAssistant = lazy(() => import("./pages/project-specific/assistant"));
const ProjectSpecificDocumentsPage = lazy(() => import("./pages/project-specific/documents"));

// Query Client otimizado para performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache mais longo para reduzir requisições
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
      
      // Retry strategy otimizada
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
      
      // Network mode otimizado
      networkMode: 'online',
      
      // Background refetch otimizado
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: true,
    },
    mutations: {
      // Retry para mutations
      retry: 1,
      networkMode: 'online',
    },
  },
});

// Componente para redirecionar usuários autenticados da landing page
const LandingPageWrapper = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageConstructionLoading text="Construindo aplicação..." />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/painel" replace />;
  }
  
  return <LandingPage />;
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* ProjectProvider agora engloba TODAS as rotas protegidas */}
            <ProjectProvider>
              <Routes>
                {/* Rotas públicas - SEM ProjectProvider */}
                <Route path="/" element={<LandingPageWrapper />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/termos" element={<LazyWrapper><Terms /></LazyWrapper>} />
                <Route path="/politica" element={<LazyWrapper><Privacy /></LazyWrapper>} />
                <Route path="/admin" element={<LazyWrapper><Admin /></LazyWrapper>} />
                
                {/* Nova rota para o painel administrativo completo */}
                <Route path="/admin-panel" element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <AdminPanel />
                    </LazyWrapper>
                  </ProtectedRoute>
                } />
                
                {/* Rotas protegidas - TODAS com ProjectProvider disponível */}
                <Route path="/painel" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                {/* Redirecionamento de rotas antigas */}
                <Route path="/projetos" element={<Navigate to="/painel" replace />} />
                <Route path="/obras" element={<Navigate to="/painel" replace />} />
                
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <Upload />
                    </LazyWrapper>
                  </ProtectedRoute>
                } />
                
                {/* Nova rota para Assistente IA */}
                <Route path="/ia" element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <Assistant />
                    </LazyWrapper>
                  </ProtectedRoute>
                } />
                
                {/* Rotas para páginas do menu */}
                <Route path="/conta" element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <Account />
                    </LazyWrapper>
                  </ProtectedRoute>
                } />
                
                <Route path="/plano" element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <Plan />
                    </LazyWrapper>
                  </ProtectedRoute>
                } />
                
                <Route path="/ajuda" element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <Help />
                    </LazyWrapper>
                  </ProtectedRoute>
                } />
                
                <Route path="/contato" element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <Contact />
                    </LazyWrapper>
                  </ProtectedRoute>
                } />
                
                {/* Layout Routes para projetos específicos */}
                <Route path="/projeto/:projectId" element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <ProjectSpecificLayout />
                    </LazyWrapper>
                  </ProtectedRoute>
                }>
                  {/* Rotas filhas aninhadas */}
                  <Route index element={<LazyWrapper><ProjectSpecificOverview /></LazyWrapper>} />
                  <Route path="orcamento" element={<LazyWrapper><ProjectSpecificBudget /></LazyWrapper>} />
                  <Route path="cronograma" element={<LazyWrapper><ProjectSpecificSchedule /></LazyWrapper>} />
                  <Route path="assistente" element={<LazyWrapper><ProjectSpecificAssistant /></LazyWrapper>} />
                  <Route path="documentos" element={<LazyWrapper><ProjectSpecificDocumentsPage /></LazyWrapper>} />
                </Route>
                
                {/* Rota especializada para IA (mantendo compatibilidade) */}
                <Route path="/ia/:projectId" element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <ProjectSpecificLayout />
                    </LazyWrapper>
                  </ProtectedRoute>
                }>
                  <Route index element={<LazyWrapper><ProjectSpecificAssistant /></LazyWrapper>} />
                </Route>

                {/* Rota 404 */}
                <Route path="*" element={<LazyWrapper><NotFound /></LazyWrapper>} />
              </Routes>
            </ProjectProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
