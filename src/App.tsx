
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  // Force logout on app start for security
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        console.log('Session cleared on app start');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
    
    // Always logout on app start for security
    handleLogout();
  }, []);

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
              <ProjectProvider>
                <Dashboard />
              </ProjectProvider>
            } />
            <Route path="/obras" element={
              <ProjectProvider>
                <Projects />
              </ProjectProvider>
            } />
            <Route path="/obra/:projectId" element={
              <ProjectProvider>
                <ProjectDetail />
              </ProjectProvider>
            } />
            <Route path="/upload" element={
              <ProjectProvider>
                <Upload />
              </ProjectProvider>
            } />
            <Route path="/assistant" element={
              <ProjectProvider>
                <Assistant />
              </ProjectProvider>
            } />
            <Route path="/budget" element={
              <ProjectProvider>
                <Budget />
              </ProjectProvider>
            } />
            <Route path="/schedule" element={
              <ProjectProvider>
                <Schedule />
              </ProjectProvider>
            } />
            <Route path="/documents" element={
              <ProjectProvider>
                <Documents />
              </ProjectProvider>
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
