
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  Bot, 
  Calculator, 
  FolderOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/types/project';

interface QuickActionsGridProps {
  currentProject: Project | null;
}

const QuickActionsGrid = ({ currentProject }: QuickActionsGridProps) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: <FolderOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Minhas Obras",
      description: "Gerenciar todos os projetos",
      path: "/obras",
      color: "from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30"
    },
    {
      icon: <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Novo Projeto",
      description: "Enviar e analisar projeto PDF",
      path: "/upload",
      color: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
    },
    {
      icon: <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Assistente IA",
      description: "Chat com IA técnica",
      path: "/assistant",
      color: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30"
    },
    {
      icon: <Calculator className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
      title: "Orçamento",
      description: "Gerar orçamento SINAPI",
      path: "/budget",
      color: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30",
      requiresProject: true
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-foreground dark:text-[#f2f2f2] mb-6">Ações Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const isDisabled = action.requiresProject && !currentProject;
          
          return (
            <Card 
              key={index} 
              className={`feature-card card-hover cursor-pointer group border-0 shadow-lg dark:bg-[#1a1a1a] dark:border-[#333] ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => !isDisabled && navigate(action.path)}
            >
              <CardHeader className="pb-4">
                <div className={`bg-gradient-to-br ${action.color} p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 mb-3`}>
                  {action.icon}
                </div>
                <CardTitle className="text-lg font-bold text-foreground dark:text-[#f2f2f2]">
                  {action.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground dark:text-[#bbbbbb]">
                  {action.description}
                  {isDisabled && (
                    <span className="block text-xs text-muted-foreground dark:text-[#bbbbbb] mt-1">
                      Requer projeto ativo
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
