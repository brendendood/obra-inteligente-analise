
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import SafeToasters from '@/components/ui/SafeToasters';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Upload from '@/pages/Upload';
import Projects from '@/pages/Index';
import ProjectDetail from '@/pages/ProjectDetail';
import Budget from '@/pages/Budget';
import Schedule from '@/pages/Schedule';
import Assistant from '@/pages/Assistant';
import Documents from '@/pages/Documents';
import Account from '@/pages/Account';
import Help from '@/pages/Help';
import Contact from '@/pages/Contact';
import Plan from '@/pages/Plan';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';
import ResetPassword from '@/pages/ResetPassword';
import AdminPanel from '@/pages/AdminPanel';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Protected routes */}
              <Route path="/painel" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/projetos" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/projeto/:id" element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } />
              <Route path="/orcamento" element={
                <ProtectedRoute>
                  <Budget />
                </ProtectedRoute>
              } />
              <Route path="/cronograma" element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } />
              <Route path="/assistente" element={
                <ProtectedRoute>
                  <Assistant />
                </ProtectedRoute>
              } />
              <Route path="/documentos" element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              } />
              <Route path="/conta" element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } />
              <Route path="/ajuda" element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              } />
              <Route path="/contato" element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              } />
              <Route path="/plano" element={
                <ProtectedRoute>
                  <Plan />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <Toaster />
            <SafeToasters />
          </div>
        </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
