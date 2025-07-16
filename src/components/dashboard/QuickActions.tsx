
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus,
  Database,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useProjectMigration } from '@/hooks/useProjectMigration';
import { useAdminAccess } from '@/hooks/useAdminAccess';

export const QuickActions = () => {
  const navigate = useNavigate();
  const { migrateProjects, isMigrating } = useProjectMigration();
  const { isAdmin, isLoading: adminLoading } = useAdminAccess();

  const handleMigration = async () => {
    try {
      await migrateProjects();
    } catch (error) {
      console.error('Erro na migração:', error);
    }
  };

  const quickActions = [
    {
      icon: Plus,
      title: "Nova Obra",
      description: "Enviar novo projeto",
      path: "/upload",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      action: () => navigate("/upload")
    },
    {
      icon: isMigrating ? RefreshCw : Database,
      title: isMigrating ? "Migrando..." : "Migrar Projetos",
      description: "Atualizar dados de projetos",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      action: handleMigration,
      disabled: isMigrating,
      isLoading: isMigrating
    },
    // Botão admin - apenas para administradores
    ...(isAdmin && !adminLoading ? [{
      icon: Settings,
      title: "Painel Admin",
      description: "Acessar painel administrativo",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      action: () => navigate("/admin-panel")
    }] : [])
  ];

  return (
    <div className="w-full min-w-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
        Ações Rápidas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full px-2 sm:px-0">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index}
              className={`
                border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group w-full min-w-0
                ${action.disabled ? 'opacity-75 cursor-not-allowed' : ''}
              `}
              onClick={action.disabled ? undefined : action.action}
            >
              <CardContent className="p-4 sm:p-6 w-full">
                <div className="flex items-center space-x-3 sm:space-x-4 w-full min-w-0">
                  <div className={`
                    p-2 sm:p-3 rounded-xl ${action.color} ${action.disabled ? '' : action.hoverColor} 
                    transition-colors flex-shrink-0
                  `}>
                    <Icon className={`
                      h-5 w-5 sm:h-6 sm:w-6 text-white
                      ${action.isLoading ? 'animate-spin' : ''}
                    `} />
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
