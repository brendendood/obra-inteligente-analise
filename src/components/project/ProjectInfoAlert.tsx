
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Calculator, Calendar, Bot, FileText } from 'lucide-react';

interface ProjectInfoAlertProps {
  activeTab: string;
  projectName: string;
}

export const ProjectInfoAlert = ({ activeTab, projectName }: ProjectInfoAlertProps) => {
  const getAlertContent = () => {
    switch (activeTab) {
      case 'orcamento':
        return {
          icon: Calculator,
          title: 'Geração de Orçamento',
          description: `Use esta seção para gerar orçamentos detalhados baseados na tabela SINAPI para ${projectName}. Os cálculos incluem BDI e são específicos para este projeto.`
        };
      case 'cronograma':
        return {
          icon: Calendar,
          title: 'Cronograma do Projeto',
          description: `Visualize e gerencie o cronograma de execução específico para ${projectName}. As etapas são calculadas baseadas na área e complexidade do projeto.`
        };
      case 'assistente':
        return {
          icon: Bot,
          title: 'Assistente IA Especializado',
          description: `Chat inteligente treinado especificamente nos dados de ${projectName}. Faça perguntas técnicas e receba respostas contextuais sobre este projeto.`
        };
      case 'documentos':
        return {
          icon: FileText,
          title: 'Documentos do Projeto',
          description: `Acesse todos os documentos relacionados a ${projectName}: PDFs originais, relatórios gerados, planilhas de orçamento e cronogramas exportáveis.`
        };
      default:
        return {
          icon: Info,
          title: 'Área de Trabalho do Projeto',
          description: `Você está na área de trabalho de ${projectName}. Use as abas acima para navegar entre orçamento, cronograma, assistente IA e documentos.`
        };
    }
  };

  const { icon: Icon, title, description } = getAlertContent();

  return (
    <Alert className="bg-blue-50/50 border-blue-200/50 backdrop-blur-sm mb-6">
      <Icon className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <span className="font-medium">{title}:</span> {description}
      </AlertDescription>
    </Alert>
  );
};
