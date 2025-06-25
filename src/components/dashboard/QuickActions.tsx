
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FolderOpen, 
  Plus, 
  Calculator
} from 'lucide-react';

export const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Plus,
      title: "Nova Obra",
      description: "Enviar novo projeto",
      path: "/upload",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      icon: FolderOpen,
      title: "Ver Obras",
      description: "Todos os projetos",
      path: "/obras",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      icon: Calculator,
      title: "Orçamento",
      description: "Gerar orçamento",
      path: "/budget",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${action.color} ${action.hoverColor} transition-colors`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
