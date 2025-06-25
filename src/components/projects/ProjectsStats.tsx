
interface ProjectsStatsProps {
  totalProjects: number;
  processedProjects: number;
}

const ProjectsStats = ({ totalProjects, processedProjects }: ProjectsStatsProps) => {
  return (
    <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span>Total: {totalProjects}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span>Processados: {processedProjects}</span>
      </div>
    </div>
  );
};

export default ProjectsStats;
