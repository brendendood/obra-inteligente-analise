
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Upload from "./pages/Upload";
import ProjectWorkspacePage from "./pages/ProjectWorkspace";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

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
  
  // Se usuário está autenticado, redirecionar para o painel
  if (isAuthenticated) {
    return <Navigate to="/painel" replace />;
  }
  
  return <LandingPage />;
};

const App = () => {
  return (
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
            
            <Route path="/obras" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <Projects />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/upload" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <Upload />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            
            {/* Área de trabalho do projeto com todas as seções */}
            <Route path="/projeto/:projectId" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <ProjectWorkspacePage />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/projeto/:projectId/orcamento" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <ProjectWorkspacePage />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/projeto/:projectId/cronograma" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <ProjectWorkspacePage />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/projeto/:projectId/assistente" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <ProjectWorkspacePage />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/projeto/:projectId/documentos" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <ProjectWorkspacePage />
                </ProjectProvider>
              </ProtectedRoute>
            } />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
