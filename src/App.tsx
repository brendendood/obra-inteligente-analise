
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Upload from "./pages/Upload";
import Assistant from "./pages/Assistant";
import Budget from "./pages/Budget";
import Schedule from "./pages/Schedule";
import Documents from "./pages/Documents";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Signup />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/politica" element={<Privacy />} />
            
            {/* Rotas protegidas com layout e ProjectProvider */}
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
            <Route path="/obra/:projectId" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <ProjectDetail />
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
            <Route path="/assistant" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <Assistant />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            <Route path="/budget" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <Budget />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <Schedule />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <Documents />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <ProjectProvider>
                  <Admin />
                </ProjectProvider>
              </ProtectedRoute>
            } />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
