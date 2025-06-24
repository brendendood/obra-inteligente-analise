
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectsStatsProps {
  totalProjects: number;
  completedProjects: number;
  analysisProjects: number;
}

const ProjectsStats = ({ totalProjects, completedProjects, analysisProjects }: ProjectsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-600">Total de Obras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900">{totalProjects}</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-600">Concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{completedProjects}</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-600">Em Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{analysisProjects}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsStats;
