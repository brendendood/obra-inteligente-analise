
interface ProjectsHeaderProps {
  totalProjects: number;
}

export const ProjectsHeader = ({ totalProjects }: ProjectsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Projetos</h1>
        <p className="text-gray-600 mt-1">{totalProjects} projetos registrados</p>
      </div>
    </div>
  );
};
