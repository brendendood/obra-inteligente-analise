
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  BarChart3, 
  CreditCard, 
  Brain,
  FileText,
  Bell,
  LogOut,
  Shield
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userEmail?: string;
}

export const AdminSidebar = ({ activeTab, onTabChange, userEmail }: AdminSidebarProps) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'ai-metrics', label: 'IA Metrics', icon: Brain },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'alerts', label: 'Alertas', icon: Bell },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r flex flex-col min-h-screen">
      {/* Header da Sidebar */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">MadenAI</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
          Super Admin
        </Badge>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-5 w-5 ${
                  activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer da Sidebar */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {userEmail}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-xs"
            onClick={() => window.location.href = '/painel'}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Voltar ao App
          </Button>
        </div>
      </div>
    </div>
  );
};
