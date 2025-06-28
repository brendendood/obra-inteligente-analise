
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Layout e páginas do projeto específico
import ProjectSpecificLayout from "./pages/project-specific/layout";
import ProjectSpecificOverview from "./pages/project-specific/overview";
import ProjectSpecificBudget from "./pages/project-specific/budget";
import ProjectSpecificSchedule from "./pages/project-specific/schedule";
import ProjectSpecificAssistant from "./pages/project-specific/assistant";
import ProjectSpecificDocumentsPage from "./pages/project-specific/documents";

const queryClient = new QueryClient();

// Componente para redirecionar usuários autenticados da landing page
const LandingPageWrapper = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
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
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<LandingPageWrapper />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Signup />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="/politica" element={<Privacy />} />
              <Route path="/admin" element={<Admin />} />
              
              {/* Rotas protegidas com ProjectProvider */}
              <Route path="/painel" element={
                <ProtectedRoute>
                  <ProjectProvider>
                    <Dashboard />
                  </ProjectProvider>
                </ProtectedRoute>
              } />
              
              {/* Redirecionamento de rotas antigas */}
              <Route path="/projetos" element={<Navigate to="/painel" replace />} />
              <Route path="/obras" element={<Navigate to="/painel" replace />} />
              
              <Route path="/upload" element={
                <ProtectedRoute>
                  <ProjectProvider>
                    <Upload />
                  </ProjectProvider>
                </ProtectedRoute>
              } />
              
              {/* Layout Routes para projetos específicos */}
              <Route path="/projeto/:projectId" element={
                <ProtectedRoute>
                  <ProjectProvider>
                    <ProjectSpecificLayout />
                  </ProjectProvider>
                </ProtectedRoute>
              }>
                {/* Rotas filhas aninhadas */}
                <Route index element={<ProjectSpecificOverview />} />
                <Route path="orcamento" element={<ProjectSpecificBudget />} />
                <Route path="cronograma" element={<ProjectSpecificSchedule />} />
                <Route path="assistente" element={<ProjectSpecificAssistant />} />
                <Route path="documentos" element={<ProjectSpecificDocumentsPage />} />
              </Route>
              
              {/* Rota especializada para IA (mantendo compatibilidade) */}
              <Route path="/ia/:projectId" element={
                <ProtectedRoute>
                  <ProjectProvider>
                    <ProjectSpecificLayout />
                  </ProjectProvider>
                </ProtectedRoute>
              }>
                <Route index element={<ProjectSpecificAssistant />} />
              </Route>

              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
