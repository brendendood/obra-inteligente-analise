
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export const useProjectTabManager = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar seção atual baseada na URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/orcamento')) return 'orcamento';
    if (path.includes('/cronograma')) return 'cronograma';
    if (path.includes('/assistente')) return 'assistente';
    if (path.includes('/documentos')) return 'documentos';
    return 'visao-geral';
  };

  const [activeTab, setActiveTab] = useState(getCurrentSection());

  // Atualizar tab ativa quando a URL mudar
  useEffect(() => {
    setActiveTab(getCurrentSection());
  }, [location.pathname]);

  const handleTabChange = (value: string, currentProject: any) => {
    if (!currentProject) return;
    
    console.log('🔄 WORKSPACE: Mudando tab para:', value);
    setActiveTab(value);
    const newPath = value === 'visao-geral' 
      ? `/projeto/${projectId}` 
      : `/projeto/${projectId}/${value}`;
    
    // Usar navigate diretamente para mudanças de tab (não salvar no histórico)
    navigate(newPath);
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'orcamento': return 'Orçamento';
      case 'cronograma': return 'Cronograma';
      case 'assistente': return 'Assistente IA';
      case 'documentos': return 'Documentos';
      default: return 'Visão Geral';
    }
  };

  return {
    activeTab,
    handleTabChange,
    getSectionTitle
  };
};
