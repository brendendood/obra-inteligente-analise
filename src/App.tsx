
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { LazyWrapper } from "@/components/ui/lazy-wrapper";
import { UnifiedLoading } from "@/components/ui/unified-loading";

// Critical pages (preloaded)
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Lazy loaded pages with intelligent preloading
const Upload = lazy(() => import("./pages/Upload"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Account = lazy(() => import("./pages/Account"));
const Plan = lazy(() => import("./pages/Plan"));
const Help = lazy(() => import("./pages/Help"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Project specific pages
const ProjectSpecificLayout = lazy(() => import("./pages/project-specific/layout"));
const ProjectSpecificOverview = lazy(() => import("./pages/project-specific/overview"));
const ProjectSpecificBudget = lazy(() => import("./pages/project-specific/budget"));
const ProjectSpecificSchedule = lazy(() => import("./pages/project-specific/schedule"));
const ProjectSpecificAssistant = lazy(() => import("./pages/project-specific/assistant"));
const ProjectSpecificDocumentsPage = lazy(() => import("./pages/project-specific/documents"));

// Ultra-optimized Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Extended cache times for better performance
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      
      // Smart retry strategy
      retry: (failureCount, error: any) => {
        if (error?.status === 404 || error?.status === 403) return false;
        return failureCount < 2;
      },
      
      // Performance optimizations
      networkMode: 'online',
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: 'always',
      
      // Request deduplication
      refetchInterval: false,
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

// Error Boundary with better performance
class PerformantErrorBoundary extends React.Component<
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
    console.error('Performance Error Boundary:', error, errorInfo);
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
    <PerformantErrorBoundary>
      <AuthProvider>
        <ImpersonationProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ProjectProvider>
                  <Suspense fallback={<UnifiedLoading />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/cadastro" element={<Signup />} />
                    <Route path="/reset-password" element={<LazyWrapper><ResetPassword /></LazyWrapper>} />
                    <Route path="/termos" element={<LazyWrapper><Terms /></LazyWrapper>} />
                    <Route path="/politica" element={<LazyWrapper><Privacy /></LazyWrapper>} />
                    <Route path="/admin" element={<Navigate to="/admin-panel" replace />} />
                    
                    <Route path="/admin-panel" element={
                      <ProtectedRoute>
                        <LazyWrapper><AdminPanel /></LazyWrapper>
                      </ProtectedRoute>
                    } />
                    
                    {/* Protected routes */}
                    <Route path="/painel" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Legacy redirects */}
                    <Route path="/projetos" element={<Navigate to="/painel" replace />} />
                    <Route path="/obras" element={<Navigate to="/painel" replace />} />
                    
                    <Route path="/upload" element={
                      <ProtectedRoute>
                        <LazyWrapper><Upload /></LazyWrapper>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/ia" element={
                      <ProtectedRoute>
                        <LazyWrapper><Assistant /></LazyWrapper>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/conta" element={
                      <ProtectedRoute>
                        <LazyWrapper><Account /></LazyWrapper>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/plano" element={
                      <ProtectedRoute>
                        <LazyWrapper><Plan /></LazyWrapper>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/ajuda" element={
                      <ProtectedRoute>
                        <LazyWrapper><Help /></LazyWrapper>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/contato" element={
                      <ProtectedRoute>
                        <LazyWrapper><Contact /></LazyWrapper>
                      </ProtectedRoute>
                    } />
                    
                    {/* Project specific routes */}
                    <Route path="/projeto/:projectId" element={
                      <ProtectedRoute>
                        <LazyWrapper><ProjectSpecificLayout /></LazyWrapper>
                      </ProtectedRoute>
                    }>
                      <Route index element={<LazyWrapper><ProjectSpecificOverview /></LazyWrapper>} />
                      <Route path="orcamento" element={<LazyWrapper><ProjectSpecificBudget /></LazyWrapper>} />
                      <Route path="cronograma" element={<LazyWrapper><ProjectSpecificSchedule /></LazyWrapper>} />
                      <Route path="assistente" element={<LazyWrapper><ProjectSpecificAssistant /></LazyWrapper>} />
                      <Route path="documentos" element={<LazyWrapper><ProjectSpecificDocumentsPage /></LazyWrapper>} />
                    </Route>
                    
                    <Route path="/ia/:projectId" element={
                      <ProtectedRoute>
                        <LazyWrapper><ProjectSpecificLayout /></LazyWrapper>
                      </ProtectedRoute>
                    }>
                      <Route index element={<LazyWrapper><ProjectSpecificAssistant /></LazyWrapper>} />
                    </Route>

                    <Route path="*" element={<LazyWrapper><NotFound /></LazyWrapper>} />
                  </Routes>
                  </Suspense>
                </ProjectProvider>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </ImpersonationProvider>
      </AuthProvider>
    </PerformantErrorBoundary>
  );
};

export default App;
