
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FolderOpen, 
  Search
} from 'lucide-react';

export const SidebarQuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Plus,
      title: "Novo Projeto",
      path: "/upload"
    },
    {
      icon: FolderOpen,
      title: "Ver Projetos",
      path: "/projetos"
    },
    {
      icon: Search,
      title: "Buscar",
      path: "/projetos?search=true"
    }
  ];

  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              onClick={() => navigate(action.path)}
              variant="outline"
              className="w-full justify-start h-12 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <Icon className="h-5 w-5 mr-3 text-gray-600" />
              <span className="font-medium">{action.title}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
