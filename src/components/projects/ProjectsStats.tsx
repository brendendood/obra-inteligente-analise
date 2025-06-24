
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectsStatsProps {
  totalProjects: number;
  completedProjects: number;
  analysisProjects: number;
}

const ProjectsStats = ({ totalProjects, completedProjects, analysisProjects }: ProjectsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="shadow-lg border-0 dark:bg-slate-800 dark:border-slate-700 glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-600 dark:text-slate-400">Total de Obras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalProjects}</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 dark:bg-slate-800 dark:border-slate-700 glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-600 dark:text-slate-400">Concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completedProjects}</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 dark:bg-slate-800 dark:border-slate-700 glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-600 dark:text-slate-400">Em Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{analysisProjects}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsStats;
