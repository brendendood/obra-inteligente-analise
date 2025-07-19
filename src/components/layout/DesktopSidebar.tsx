import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const DesktopSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const quickActions = [
    {
      icon: Plus,
      title: "Nova Obra",
      path: "/upload",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Assistente IA",
      description: "Assistente geral para detalhes de arquitetura e engenharia",
      path: "/ia",
      color: "bg-green-500 hover:bg-green-600"
    }
  ];

  return (
    <div className="hidden lg:flex w-64 bg-gray-50 border-r border-gray-200 flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-gray-800">MadenAI</span>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900 text-lg">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isActive = location.pathname === action.path;
              
              return (
                <Button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`w-full flex items-center justify-start space-x-3 p-3 h-auto ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : action.color + ' text-white'
                  } transition-all duration-200`}
                  variant="ghost"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{action.title}</span>
                    {action.description && (
                      <span className="text-xs opacity-90 mt-1">{action.description}</span>
                    )}
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};