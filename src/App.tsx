import React, { Suspense, lazy, useMemo } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/SafeAuthProvider";
import { ImpersonationProvider } from "@/contexts/ImpersonationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { LazyWrapper } from "@/components/ui/lazy-wrapper";
import { UnifiedLoading } from "@/components/ui/unified-loading";

// Critical pages (preloaded)
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SimpleDashboard from "./pages/SimpleDashboard"; // DASHBOARD SIMPLES PARA TESTE

// Lazy loaded pages
const Upload = lazy(() => import("./pages/Upload"));
const Projects = lazy(() => import("./pages/Projects"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Budget = lazy(() => import("./pages/Budget"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Documents = lazy(() => import("./pages/Documents"));
const Account = lazy(() => import("./pages/Account"));
const Plan = lazy(() => import("./pages/Plan"));
const Help = lazy(() => import("./pages/Help"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Project specific
const ProjectSpecificLayout = lazy(() => import("./pages/project-specific/layout"));
const Overview = lazy(() => import("./pages/project-specific/overview"));
const ProjectSpecificBudget = lazy(() => import("./pages/ProjectSpecificBudget"));
const ProjectSpecificSchedule = lazy(() => import("./pages/ProjectSpecificSchedule"));
const ProjectSpecificAssistant = lazy(() => import("./pages/ProjectSpecificAssistant"));
const ProjectSpecificDocuments = lazy(() => import("./pages/ProjectSpecificDocuments"));

const App = () => {
  console.log('🔥 APP: Renderizado com SafeAuth + Impersonation');
  
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      },
    },
  }), []);

  return (
    <AuthProvider>
      <ImpersonationProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <Suspense fallback={<UnifiedLoading />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/termos" element={<LazyWrapper><Terms /></LazyWrapper>} />
                  <Route path="/privacidade" element={<LazyWrapper><Privacy /></LazyWrapper>} />
                  
                  {/* Protected routes */}
                  <Route path="/painel" element={
                    <ProtectedRoute>
                      <SimpleDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/projetos" element={
                    <ProtectedRoute>
                      <LazyWrapper><Projects /></LazyWrapper>
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<LazyWrapper><NotFound /></LazyWrapper>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            
            {/* Toasters */}
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </QueryClientProvider>
        
        {/* DEBUG INFO */}
        <div style={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          background: 'purple', 
          color: 'white', 
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <div>🧪 TESTE: DASHBOARD SIMPLES</div>
          <div>Se não há loop = Dashboard era o problema</div>
        </div>
      </ImpersonationProvider>
    </AuthProvider>
  );
};

export default App;