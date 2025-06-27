
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateProjectSchedule } from '@/utils/scheduleGenerator';

interface Project {
  id: string;
  name: string;
  file_path: string;
  file_size?: number;
  extracted_text?: string;
  analysis_data?: any;
  project_type?: string;
  total_area?: number;
  created_at: string;
  updated_at: string;
}

export const useProjectDetailLogic = () => {
  const { projectId } = useParams();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [budgetData, setBudgetData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (projectId && isAuthenticated) {
      loadProject();
    }
  }, [projectId, isAuthenticated, authLoading, navigate]);

  const loadProject = async () => {
    if (!projectId) {
      setError('ID do projeto não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Projeto não encontrado');
        } else {
          setError(`Erro ao carregar projeto: ${fetchError.message}`);
        }
        return;
      }

      if (!data) {
        setError('Projeto não encontrado');
        return;
      }

      setProject(data);
      console.log('✅ Projeto carregado com sucesso:', data.name);
      
      if (data.analysis_data) {
        generateProjectSpecificData(data);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setError('Erro inesperado ao carregar projeto');
    } finally {
      setLoading(false);
    }
  };

  const generateProjectSpecificData = (projectData: Project) => {
    try {
      const baseSchedule = generateProjectSchedule(projectData);
      setScheduleData(baseSchedule);
      console.log('✅ Cronograma base gerado para:', projectData.name);
    } catch (error) {
      console.error('❌ Erro ao gerar dados do projeto:', error);
    }
  };

  const getPdfUrl = () => {
    if (!project?.file_path) return null;
    
    const { data } = supabase.storage
      .from('project-files')
      .getPublicUrl(project.file_path);
    
    return data?.publicUrl || null;
  };

  const handleBudgetGeneration = async () => {
    if (!project) return;
    
    setBudgetLoading(true);
    
    try {
      const response = await fetch('https://brendendood.app.n8n.cloud/webhook-test/agente-ia-orcamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
          projectName: project.name,
          projectData: project.analysis_data,
          totalArea: project.total_area,
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com o serviço de orçamento');
      }

      const data = await response.json();
      setBudgetData(data);
      setActiveTab('budget');
      
      toast({
        title: "✅ Orçamento gerado!",
        description: "Orçamento baseado na tabela SINAPI criado com sucesso.",
      });
    } catch (error) {
      console.error('Budget generation error:', error);
      toast({
        title: "❌ Erro no orçamento",
        description: "Não foi possível gerar o orçamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleScheduleGeneration = async () => {
    if (!project) return;
    
    setScheduleLoading(true);
    
    try {
      const projectSchedule = generateProjectSchedule(project);
      setScheduleData(projectSchedule);
      setActiveTab('schedule');
      
      toast({
        title: "📅 Cronograma atualizado!",
        description: `Cronograma específico para ${project.name} (${project.total_area}m²) criado com dependências e durações otimizadas.`,
      });
    } catch (error) {
      console.error('Schedule generation error:', error);
      toast({
        title: "❌ Erro no cronograma",
        description: "Não foi possível gerar o cronograma.",
        variant: "destructive",
      });
    } finally {
      setScheduleLoading(false);
    }
  };

  return {
    project,
    loading,
    error,
    authLoading,
    isAuthenticated,
    budgetLoading,
    scheduleLoading,
    activeTab,
    budgetData,
    scheduleData,
    setActiveTab,
    loadProject,
    getPdfUrl,
    handleBudgetGeneration,
    handleScheduleGeneration,
    navigate,
    toast,
  };
};
