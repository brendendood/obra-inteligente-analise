
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectsStatsProps {
  totalProjects: number;
  completedProjects: number;
  analysisProjects: number;
}

const ProjectsStats = ({ totalProjects, completedProjects, analysisProjects }: ProjectsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-300 font-medium">Total de Obras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{totalProjects}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-300 font-medium">Concluídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-400">{completedProjects}</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-300 font-medium">Em Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-400">{analysisProjects}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsStats;
