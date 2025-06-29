
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from '@/contexts/ProjectContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Páginas principais
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Projects from './pages/Projects';
import ProjectWorkspacePage from './pages/ProjectWorkspace';
import AssistantPage from './pages/Assistant';
import AdminPanel from './pages/AdminPanel';
import Admin from './pages/Admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Rotas protegidas SEM ProjectProvider */}
              <Route 
                path="/painel" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas protegidas COM ProjectProvider */}
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <ProjectProvider>
                      <Upload />
                    </ProjectProvider>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/projetos" 
                element={
                  <ProtectedRoute>
                    <ProjectProvider>
                      <Projects />
                    </ProjectProvider>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ia" 
                element={
                  <ProtectedRoute>
                    <ProjectProvider>
                      <AssistantPage />
                    </ProjectProvider>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas de projeto específico COM ProjectProvider */}
              <Route 
                path="/projeto/:projectId" 
                element={
                  <ProtectedRoute>
                    <ProjectProvider>
                      <ProjectWorkspacePage />
                    </ProjectProvider>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/projeto/:projectId/:section" 
                element={
                  <ProtectedRoute>
                    <ProjectProvider>
                      <ProjectWorkspacePage />
                    </ProjectProvider>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas administrativas SEM ProjectProvider */}
              <Route 
                path="/admin-panel" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirecionamento padrão */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
