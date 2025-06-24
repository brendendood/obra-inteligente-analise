
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { Project } from '@/types/project';

interface DashboardStatsProps {
  projects: Project[];
}

const DashboardStats = ({ projects }: DashboardStatsProps) => {
  const totalProjects = projects.length;
  const totalArea = projects.reduce((sum, project) => sum + (project.total_area || 0), 0);
  const recentProjects = projects.filter(
    project => new Date(project.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const stats = [
    {
      title: 'Total de Projetos',
      value: totalProjects,
      description: totalProjects === 1 ? 'projeto analisado' : 'projetos analisados',
      icon: FileText,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Área Total',
      value: `${totalArea.toLocaleString()}m²`,
      description: 'área construída total',
      icon: BarChart3,
      color: 'from-green-600 to-emerald-600'
    },
    {
      title: 'Projetos Recentes',
      value: recentProjects,
      description: 'últimos 7 dias',
      icon: TrendingUp,
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Tempo Economizado',
      value: `${totalProjects * 2}h`,
      description: 'em análises manuais',
      icon: Clock,
      color: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-[#1a1a1a] border-[#333] hover:bg-[#222] transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              {stat.title}
            </CardTitle>
            <div className={`bg-gradient-to-r ${stat.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <p className="text-xs text-gray-500">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
