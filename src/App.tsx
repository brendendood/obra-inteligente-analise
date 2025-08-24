import * as React from 'react';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from "next-themes";
import SafeToasters from "@/components/ui/SafeToasters";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { AuthProvider } from "@/contexts/SimpleAuthProvider";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { EmergencyFallback } from "@/components/error/EmergencyFallback";
import { LazyWrapper } from "@/components/ui/lazy-wrapper";
import { UnifiedLoading } from "@/components/ui/unified-loading";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactHealthCheck } from "@/components/error/ReactHealthCheck";
import { SafeHooksProvider } from "@/components/providers/SafeHooksProvider";

// Critical pages (preloaded)
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ConfirmAccount from "./pages/ConfirmAccount";
import ConfirmEmail from "./pages/ConfirmEmail";
import Dashboard from "./pages/Dashboard";
import Redirect from "./pages/Redirect";

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

// CRITICAL Error Boundary for React system issues
class CriticalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error; errorInfo?: React.ErrorInfo; isCritical?: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, isCritical: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🔴 CRITICAL ERROR BOUNDARY:', error.message);
    
    // Detect critical React errors (incl. useRef null from broken libs)
    const msg = error?.message || '';
    const isCritical = msg.includes('useState') || 
                      msg.includes('Invalid hook call') ||
                      msg.includes('multiple copies of React') ||
                      msg.includes("reading 'useRef'") ||
                      msg.includes('useRef') ||
                      msg.includes('useContext') ||
                      msg.includes('Cannot read properties of null');
    
    return { hasError: true, error, isCritical };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 ERROR BOUNDARY DETAILS:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // For critical React errors, force reload after showing message
    if (this.state.isCritical) {
      console.error('🔴 CRITICAL REACT ERROR DETECTED - FORCING RELOAD');
      setTimeout(() => {
        // Clear all caches
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        window.location.reload();
      }, 3000);
    }

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Use emergency fallback for critical React errors
      if (this.state.isCritical) {
        return (
          <EmergencyFallback 
            error={this.state.error} 
            resetError={() => {
              this.setState({ hasError: false, error: undefined, isCritical: false });
            }}
          />
        );
      }
      
      // Use normal error fallback for other errors
      return (
        <ErrorFallback 
          error={this.state.error} 
          resetError={() => {
            this.setState({ hasError: false, error: undefined });
          }}
        />
      );
    }

    return this.props.children;
  }
}

// Clean Providers Component - ThemeProvider temporarily removed due to React corruption
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SafeHooksProvider>
    <AuthProvider>
      <ImpersonationProvider>
        <QueryClientProvider client={queryClient}>
          <ProjectProvider>
            <TooltipProvider delayDuration={200}>
              {children}
            </TooltipProvider>
          </ProjectProvider>
        </QueryClientProvider>
      </ImpersonationProvider>
    </AuthProvider>
  </SafeHooksProvider>
);

const App = () => {
  return (
    <CriticalErrorBoundary>
      <ReactHealthCheck>
        <AppProviders>
          <BrowserRouter>
            <Suspense fallback={<UnifiedLoading />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/signup" element={<Navigate to="/cadastro" replace />} />
                <Route path="/reset-password" element={<LazyWrapper><ResetPassword /></LazyWrapper>} />
                <Route path="/v/*" element={<Redirect />} />
                <Route path="/auth/callback" element={<ConfirmAccount />} />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/termos" element={<LazyWrapper><Terms /></LazyWrapper>} />
                <Route path="/politica" element={<LazyWrapper><Privacy /></LazyWrapper>} />
                <Route path="/admin" element={<Navigate to="/admin-panel" replace />} />
                
                <Route path="/admin-panel" element={
                  <ProtectedRoute>
                    <LazyWrapper><AdminPanel /></LazyWrapper>
                  </ProtectedRoute>
                } />
                
                {/* Protected routes */}
                <Route path="/app" element={<Navigate to="/painel" replace />} />
                <Route path="/dashboard" element={<Navigate to="/painel" replace />} />
                
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
            {/* Monta toasts após o Router para evitar qualquer problema de contexto/hook */}
            <SafeToasters />
          </BrowserRouter>
        </AppProviders>
      </ReactHealthCheck>
    </CriticalErrorBoundary>
  );
};

export default App;
