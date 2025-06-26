
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  FolderOpen, 
  Search,
  Zap
} from 'lucide-react';

export const SidebarQuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Plus,
      title: "Novo Projeto",
      path: "/upload",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: FolderOpen,
      title: "Ver Projetos",
      path: "/projetos",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Search,
      title: "Buscar",
      path: "/projetos?search=true",
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-gray-900 text-lg">
          <Zap className="h-5 w-5 text-orange-500" />
          <span>Ações Rápidas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg ${action.color} text-white transition-all duration-200 hover:shadow-lg`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{action.title}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};
