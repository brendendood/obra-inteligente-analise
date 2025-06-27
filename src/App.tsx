import { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { DomainProvider } from "@/components/layout/DomainProvider";
import { NotificationContainer } from "@/components/ui/notification-container";
import { testSupabaseConnection } from "@/integrations/supabase/domainClient";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Upload from "@/pages/Upload";
import Admin from "@/pages/Admin";
import ProjectDetail from "@/pages/ProjectDetail";
import ProjectSpecificBudget from "@/pages/ProjectSpecificBudget";
import ProjectSpecificSchedule from "@/pages/ProjectSpecificSchedule";
import ProjectSpecificDocuments from "@/pages/ProjectSpecificDocuments";
import ProjectSpecificAssistant from "@/pages/ProjectSpecificAssistant";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  // Testar conexão Supabase na inicialização
  useEffect(() => {
    testSupabaseConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <DomainProvider>
        <ProjectProvider>
          <TooltipProvider>
            <NotificationContainer />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<div>Carregando...</div>}>
                <Routes>
                  {/* Landing Page */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Signup />} />
                  
                  {/* Onboarding */}
                  <Route path="/tutorial" element={<Onboarding />} />
                  
                  {/* Protected Routes */}
                  <Route path="/painel" element={<Dashboard />} />
                  <Route path="/projetos" element={<Projects />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/admin" element={<Admin />} />
                  
                  {/* Project Routes */}
                  <Route path="/projeto/:projectId" element={<ProjectDetail />} />
                  <Route path="/projeto/:projectId/orcamento" element={<ProjectSpecificBudget />} />
                  <Route path="/projeto/:projectId/cronograma" element={<ProjectSpecificSchedule />} />
                  <Route path="/projeto/:projectId/documentos" element={<ProjectSpecificDocuments />} />
                  <Route path="/projeto/:projectId/assistente" element={<ProjectSpecificAssistant />} />
                  
                  {/* Legal Pages */}
                  <Route path="/termos" element={<Terms />} />
                  <Route path="/privacidade" element={<Privacy />} />
                  
                  {/* 404 */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ProjectProvider>
      </DomainProvider>
    </QueryClientProvider>
  );
};

export default App;
