
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Bot, Calculator, Calendar, FileText, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionsGrid = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Enviar Projeto',
      description: 'Faça upload de um novo PDF',
      icon: Upload,
      path: '/upload',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Assistente IA',
      description: 'Converse com a IA sobre seus projetos',
      icon: Bot,
      path: '/assistant',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Criar Orçamento',
      description: 'Calcule custos do projeto',
      icon: Calculator,
      path: '/budget',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Cronograma',
      description: 'Planeje as etapas da obra',
      icon: Calendar,
      path: '/schedule',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Documentos',
      description: 'Gerencie arquivos do projeto',
      icon: FileText,
      path: '/documents',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Relatórios',
      description: 'Visualize análises detalhadas',
      icon: BarChart3,
      path: '/obras',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Ações Rápidas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Card 
            key={index}
            className="bg-card border-border hover:shadow-md hover:border-primary/20 transition-all duration-200 group cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`bg-gradient-to-r ${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform shadow-sm`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-foreground text-base group-hover:text-primary transition-colors">
                  {action.title}
                </CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                {action.description}
              </p>
              <Button
                onClick={() => navigate(action.path)}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/10 w-full"
              >
                Acessar →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
