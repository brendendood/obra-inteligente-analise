import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Settings } from 'lucide-react';
import { useUnifiedAdmin } from '@/hooks/useUnifiedAdmin';
export const QuickActions = () => {
  const navigate = useNavigate();
  const {
    isAdmin,
    loading: adminLoading
  } = useUnifiedAdmin();
  const quickActions = [{
    icon: Plus,
    title: "Nova Obra",
    description: "Enviar novo projeto",
    path: "/upload",
    action: () => navigate("/upload")
  },
  // Botão admin - apenas para administradores
  ...(isAdmin && !adminLoading ? [{
    icon: Settings,
    title: "Painel Admin",
    description: "Acessar painel administrativo",
    action: () => navigate("/admin-panel")
  }] : [])];
  return <div className="w-full min-w-0 py-0">
      <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
        Ações Rápidas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {quickActions.map((action, index) => {
        const Icon = action.icon;
        return <Card key={index} className="border border-border bg-card hover:bg-accent/50 transition-all duration-200 cursor-pointer group rounded-apple shadow-sm hover:shadow-md" onClick={action.action}>
              <CardContent className="p-6 w-full">
                <div className="flex items-center space-x-4 w-full min-w-0">
                  <div className="p-3 rounded-apple bg-primary text-primary-foreground flex-shrink-0">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {action.title}
                    </h3>
                    <p className="text-muted-foreground text-sm break-words">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>
    </div>;
};