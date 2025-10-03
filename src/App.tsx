import React, { Suspense, lazy, useMemo } from 'react';
import SafeToasters from "@/components/ui/SafeToasters";
import { ThemeProvider } from "@/components/theme-provider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PaywallGuard from "@/components/guards/PaywallGuard";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { EmergencyFallback } from "@/components/error/EmergencyFallback";
import { LazyWrapper } from "@/components/ui/lazy-wrapper";
import { UnifiedLoading } from "@/components/ui/unified-loading";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CRMBlock, AIGeneralBlock, ProjectAIAssistantBlock } from "@/components/blocks/FeatureBlocks";

// Critical pages (preloaded)
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ConfirmAccount from "./pages/ConfirmAccount";
import ConfirmEmail from "./pages/ConfirmEmail";
import Dashboard from "./pages/Dashboard";
import Redirect from "./pages/Redirect";
import AuthCallback from "./pages/AuthCallback";
import EmailSucesso from "./pages/EmailSucesso";
import OnboardingFlow from "./pages/OnboardingFlow";
import SelectPlan from "./pages/SelectPlan";
import VerifyEmail from "./pages/VerifyEmail";

// Lazy loaded pages with intelligent preloading
const Upload = lazy(() => import("./pages/Upload"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Account = lazy(() => import("./pages/Account"));
const Plan = lazy(() => import("./pages/Plan"));
const Billing = lazy(() => import("./pages/Billing"));
const Help = lazy(() => import("./pages/Help"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminUserCRMView = lazy(() => import("./pages/AdminUserCRMView"));
const CRMPage = lazy(() => import("./pages/CRMPage"));
const AdminCRMPage = lazy(() => import("./pages/AdminCRMPage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminVerification = lazy(() => import("./pages/AdminVerification"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Project specific pages
const ProjectSpecificLayout = lazy(() => import("./pages/project-specific/layout"));
const ProjectSpecificOverview = lazy(() => import("./pages/project-specific/overview"));
const ProjectSpecificBudget = lazy(() => import("./pages/project-specific/budget"));
const ProjectSpecificSchedule = lazy(() => import("./pages/project-specific/schedule"));
const ProjectSpecificAssistant = lazy(() => import("./pages/project-specific/assistant"));
const ProjectSpecificDocumentsPage = lazy(() => import("./pages/project-specific/documents"));

// Create QueryClient in a function to ensure React is ready
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (error?.status === 404 || error?.status === 403) return false;
        return failureCount < 2;
      },
      networkMode: 'online',
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: 'always',
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
    console.error('🔴 ERROR BOUNDARY CAUGHT:', error.message);
    
    // Detect ONLY truly critical React hook errors
    const msg = error?.message || '';
    const isCritical = 
      msg.includes('Invalid hook call') ||
      msg.includes('multiple copies of React') ||
      (msg.includes('Cannot read properties of null') && 
       (msg.includes('useState') || msg.includes('useEffect') || msg.includes('useContext')));
    
    return { hasError: true, error, isCritical };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔴 ERROR DETAILS:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      isCritical: this.state.isCritical
    });

    // Log critical errors but let user decide to reload via UI button
    if (this.state.isCritical) {
      console.error('⚠️ CRITICAL REACT ERROR - User can reload via UI');
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

// Clean Providers Component - Create QueryClient safely inside component
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create QueryClient after React is confirmed working
  const queryClient = useMemo(() => createQueryClient(), []);
  
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <CriticalErrorBoundary>
      <AppProviders>
          <BrowserRouter>
            <Suspense fallback={<UnifiedLoading />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Signup />} />
                <Route path="/signup" element={<Navigate to="/cadastro" replace />} />
                <Route path="/verificar-email" element={<VerifyEmail />} />
                <Route path="/selecionar-plano" element={<SelectPlan />} />
                <Route path="/reset-password" element={<LazyWrapper><ResetPassword /></LazyWrapper>} />
                <Route path="/v/*" element={<Redirect />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/email/sucesso" element={<EmailSucesso />} />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/onboarding" element={<OnboardingFlow />} />
                <Route path="/cadastro/confirmado" element={<ConfirmEmail />} />
                <Route path="/cadastro/token-invalido" element={<ConfirmEmail />} />
                <Route path="/termos" element={<LazyWrapper><Terms /></LazyWrapper>} />
                <Route path="/terms" element={<LazyWrapper><Terms /></LazyWrapper>} />
                <Route path="/politica" element={<LazyWrapper><Privacy /></LazyWrapper>} />
                <Route path="/privacy" element={<LazyWrapper><Privacy /></LazyWrapper>} />
                <Route path="/admin" element={<Navigate to="/admin-panel" replace />} />
                
                <Route path="/admin-panel" element={
                  <ProtectedRoute>
                    <LazyWrapper><AdminPanel /></LazyWrapper>
                  </ProtectedRoute>
                } />
                
                <Route path="/admin-panel/crm-user/:userId" element={
                  <ProtectedRoute>
                    <LazyWrapper><AdminUserCRMView /></LazyWrapper>
                  </ProtectedRoute>
                } />
                
                {/* Protected routes */}
                <Route path="/app" element={<Navigate to="/painel" replace />} />
                <Route path="/dashboard" element={<Navigate to="/painel" replace />} />
                
                <Route path="/painel" element={
                  <ProtectedRoute>
                    <PaywallGuard>
                      <Dashboard />
                    </PaywallGuard>
                  </ProtectedRoute>
                } />
                
                {/* Legacy redirects */}
                <Route path="/projetos" element={<Navigate to="/painel" replace />} />
                <Route path="/obras" element={<Navigate to="/painel" replace />} />
                
                <Route path="/upload" element={
                  <ProtectedRoute>
                    <PaywallGuard>
                      <LazyWrapper><Upload /></LazyWrapper>
                    </PaywallGuard>
                  </ProtectedRoute>
                } />
                
                {/* AI Assistant - BASIC+ */}
                <Route path="/ia" element={
                  <ProtectedRoute>
                    <PaywallGuard>
                      <LazyWrapper>
                        <AIGeneralBlock>
                          <Assistant />
                        </AIGeneralBlock>
                      </LazyWrapper>
                    </PaywallGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/conta" element={
                  <ProtectedRoute>
                    <PaywallGuard>
                      <LazyWrapper><Account /></LazyWrapper>
                    </PaywallGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/plano" element={
                  <ProtectedRoute>
                    {/* Remover PaywallGuard - página de planos deve ser sempre acessível */}
                    <LazyWrapper><Plan /></LazyWrapper>
                  </ProtectedRoute>
                } />
                
                <Route path="/account/billing" element={
                  <ProtectedRoute>
                    {/* Página de billing sempre acessível - nunca redireciona para pricing-blocked */}
                    <LazyWrapper><Billing /></LazyWrapper>
                  </ProtectedRoute>
                } />
                
                <Route path="/ajuda" element={
                  <ProtectedRoute>
                    <PaywallGuard>
                      <LazyWrapper><Help /></LazyWrapper>
                    </PaywallGuard>
                  </ProtectedRoute>
                } />
                
                <Route path="/contato" element={
                  <ProtectedRoute>
                    <PaywallGuard>
                      <LazyWrapper><Contact /></LazyWrapper>
                    </PaywallGuard>
                  </ProtectedRoute>
                } />
                
                {/* CRM Page - ENTERPRISE only */}
                <Route path="/crm" element={
                  <ProtectedRoute>
                    <PaywallGuard>
                      <LazyWrapper>
                        <CRMBlock>
                          <CRMPage />
                        </CRMBlock>
                      </LazyWrapper>
                    </PaywallGuard>
                  </ProtectedRoute>
                } />
                
                
                 <Route path="/admin/crm" element={
                   <ProtectedRoute>
                     <LazyWrapper><AdminCRMPage /></LazyWrapper>
                   </ProtectedRoute>
                 } />
                 
                 <Route path="/admin/users" element={
                   <ProtectedRoute>
                     <LazyWrapper><AdminUsers /></LazyWrapper>
                   </ProtectedRoute>
                 } />
                 
                 <Route path="/admin/verification" element={
                   <ProtectedRoute>
                     <LazyWrapper><AdminVerification /></LazyWrapper>
                   </ProtectedRoute>
                 } />
                
                {/* Project specific routes */}
                <Route path="/projeto/:projectId" element={
                  <ProtectedRoute>
                    <PaywallGuard>
                      <LazyWrapper><ProjectSpecificLayout /></LazyWrapper>
                    </PaywallGuard>
                  </ProtectedRoute>
                }>
                  <Route index element={<LazyWrapper><ProjectSpecificOverview /></LazyWrapper>} />
                  <Route path="orcamento" element={<LazyWrapper><ProjectSpecificBudget /></LazyWrapper>} />
                  <Route path="cronograma" element={<LazyWrapper><ProjectSpecificSchedule /></LazyWrapper>} />
                  <Route path="assistente" element={
                    <LazyWrapper>
                      <ProjectAIAssistantBlock>
                        <ProjectSpecificAssistant />
                      </ProjectAIAssistantBlock>
                    </LazyWrapper>
                  } />
                  <Route path="documentos" element={<LazyWrapper><ProjectSpecificDocumentsPage /></LazyWrapper>} />
                </Route>
                
                <Route path="/ia/:projectId" element={
                  <ProtectedRoute>
                    <PaywallGuard>
                      <LazyWrapper><ProjectSpecificLayout /></LazyWrapper>
                    </PaywallGuard>
                  </ProtectedRoute>
                }>
                  <Route index element={
                    <LazyWrapper>
                      <ProjectAIAssistantBlock>
                        <ProjectSpecificAssistant />
                      </ProjectAIAssistantBlock>
                    </LazyWrapper>
                  } />
                </Route>

                <Route path="*" element={<LazyWrapper><NotFound /></LazyWrapper>} />
              </Routes>
            </Suspense>
            {/* Monta toasts após o Router para evitar qualquer problema de contexto/hook */}
            <SafeToasters />
          </BrowserRouter>
        </AppProviders>
    </CriticalErrorBoundary>
  );
};

export default App;
