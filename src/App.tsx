import React, { Suspense, lazy, useMemo } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { LazyWrapper } from "@/components/ui/lazy-wrapper";
import { UnifiedLoading } from "@/components/ui/unified-loading";
// import { ErrorBoundary } from 'react-error-boundary';

// Critical pages (preloaded)
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

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
// const ProjectNavigationExample = lazy(() => import("./components/examples/ProjectNavigationExample"));

// STEP 1: APP SEM CONTEXTOS PROBLEMÁTICOS
const App = () => {
  console.log('🔥 APP: Renderizado (Sem AuthProvider)');
  
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
    <div>
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
                
                {/* Protected routes SEM AuthProvider por enquanto */}
                <Route path="/painel" element={<Dashboard />} />
                <Route path="/projetos" element={<LazyWrapper><Projects /></LazyWrapper>} />
                
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
        background: 'green', 
        color: 'white', 
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <div>STEP 1: SEM AUTH</div>
        <div>Se não há loop = Auth é o problema</div>
      </div>
    </div>
  );
};

export default App;