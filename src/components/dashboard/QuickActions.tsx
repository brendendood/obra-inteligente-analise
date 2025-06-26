
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
    <div className="w-full min-w-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
        Ações Rápidas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full px-2 sm:px-0">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group w-full min-w-0"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-4 sm:p-6 w-full">
                <div className="flex items-center space-x-3 sm:space-x-4 w-full min-w-0">
                  <div className={`
                    p-2 sm:p-3 rounded-xl ${action.color} ${action.hoverColor} 
                    transition-colors flex-shrink-0
                  `}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm break-words">
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
