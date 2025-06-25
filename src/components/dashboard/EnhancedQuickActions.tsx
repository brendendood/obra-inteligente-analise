
import { useNavigate } from 'react-router-dom';
import { AnimatedCard } from '@/components/ui/animated-card';
import { 
  Plus, 
  FolderOpen, 
  Calculator,
  Upload,
  Search,
  Zap
} from 'lucide-react';

export const EnhancedQuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Plus,
      title: "Novo Projeto",
      description: "Enviar projeto PDF",
      path: "/upload",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700"
    },
    {
      icon: FolderOpen,
      title: "Ver Projetos",
      description: "Todos os projetos",
      path: "/projetos",
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700"
    },
    {
      icon: Search,
      title: "Buscar",
      description: "Localizar projeto",
      path: "/projetos?search=true",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ações Rápidas</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Zap className="h-4 w-4" />
          <span>Acesso rápido</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <AnimatedCard 
              key={index}
              hoverEffect="lift"
              onClick={() => navigate(action.path)}
              className="group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${action.gradient} group-hover:bg-gradient-to-r group-hover:${action.hoverGradient} transition-all duration-300 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          );
        })}
      </div>
    </div>
  );
};
