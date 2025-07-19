import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from '@/contexts/ProjectContext';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import Budget from "./pages/Budget";
import Schedule from "./pages/Schedule";
import Assistant from "./pages/Assistant";
import Documents from "./pages/Documents";
import ProjectSpecificBudget from "./pages/ProjectSpecificBudget";
import ProjectSpecificSchedule from "./pages/ProjectSpecificSchedule";
import ProjectSpecificAssistant from "./pages/ProjectSpecificAssistant";
import ProjectSpecificDocuments from "./pages/ProjectSpecificDocuments";
import Admin from "./pages/Admin";
import AdminPanel from "./pages/AdminPanel";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import SinapiPage from "./pages/SinapiPage";
import SupabasePage from "./pages/SupabasePage";
import N8NPage from "./pages/N8NPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/index" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cadastro" element={<Signup />} />
              <Route path="/painel" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/projetos" element={<Projects />} />
              <Route path="/projeto/:projectId" element={<ProjectDetail />} />
              <Route path="/projeto/:projectId/workspace" element={<ProjectWorkspace />} />
              <Route path="/projeto/:projectId/orcamento" element={<ProjectSpecificBudget />} />
              <Route path="/projeto/:projectId/cronograma" element={<ProjectSpecificSchedule />} />
              <Route path="/projeto/:projectId/assistente" element={<ProjectSpecificAssistant />} />
              <Route path="/projeto/:projectId/documentos" element={<ProjectSpecificDocuments />} />
              <Route path="/orcamento" element={<Budget />} />
              <Route path="/cronograma" element={<Schedule />} />
              <Route path="/assistente" element={<Assistant />} />
              <Route path="/documentos" element={<Documents />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="/politica" element={<Privacy />} />
              <Route path="/sinapi" element={<SinapiPage />} />
              <Route path="/supabase" element={<SupabasePage />} />
              <Route path="/n8n" element={<N8NPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProjectProvider>
    </QueryClientProvider>
  );
}

export default App;
