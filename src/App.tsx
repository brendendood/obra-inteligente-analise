
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

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Signup />} />
            
            {/* Protected routes with ProjectProvider */}
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
            
            {/* Public routes */}
            <Route path="/termos" element={<Terms />} />
            <Route path="/politica" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
