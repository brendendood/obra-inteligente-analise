import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Upload, BarChart3, MessageSquare, Calendar } from 'lucide-react';
interface ActivityItem {
  id: string;
  type: 'upload' | 'analysis' | 'budget' | 'chat' | 'schedule';
  project: string;
  action: string;
  timestamp: Date;
}
interface RecentActivityProps {
  projects: any[];
}
export const RecentActivity = ({
  projects
}: RecentActivityProps) => {
  // Gerar atividades baseadas nos projetos existentes
  const generateActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    projects.slice(0, 12).forEach((project, index) => {
      const baseDate = new Date(project.created_at);

      // Atividade de upload
      activities.push({
        id: `${project.id}-upload`,
        type: 'upload',
        project: project.name,
        action: 'Projeto enviado',
        timestamp: baseDate
      });

      // Atividade de análise (se processado)
      if (project.analysis_data) {
        const analysisDate = new Date(baseDate.getTime() + 5 * 60 * 1000); // 5 min depois
        activities.push({
          id: `${project.id}-analysis`,
          type: 'analysis',
          project: project.name,
          action: 'Análise concluída',
          timestamp: analysisDate
        });
      }

      // Atividades simuladas adicionais para projetos mais recentes
      if (index < 6) {
        const budgetDate = new Date(baseDate.getTime() + 2 * 60 * 60 * 1000); // 2h depois
        activities.push({
          id: `${project.id}-budget`,
          type: 'budget',
          project: project.name,
          action: 'Orçamento gerado',
          timestamp: budgetDate
        });
        const scheduleDate = new Date(baseDate.getTime() + 4 * 60 * 60 * 1000); // 4h depois
        activities.push({
          id: `${project.id}-schedule`,
          type: 'schedule',
          project: project.name,
          action: 'Cronograma criado',
          timestamp: scheduleDate
        });
      }
    });
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  };
  const activities = generateActivities();
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Upload className="h-4 w-4 text-blue-600" />;
      case 'analysis':
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      case 'budget':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-orange-600" />;
      case 'schedule':
        return <Calendar className="h-4 w-4 text-indigo-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'bg-blue-50 border-blue-200';
      case 'analysis':
        return 'bg-green-50 border-green-200';
      case 'budget':
        return 'bg-purple-50 border-purple-200';
      case 'chat':
        return 'bg-orange-50 border-orange-200';
      case 'schedule':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };
  if (activities.length === 0) {
    return <Card className="border-0 shadow-lg h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Clock className="h-5 w-5 text-gray-600" />
            <span>Atividade Recente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma atividade recente</p>
            <p className="text-sm text-gray-400 mt-1">
              Suas ações nos projetos aparecerão aqui
            </p>
          </div>
        </CardContent>
      </Card>;
  }
  return;
};