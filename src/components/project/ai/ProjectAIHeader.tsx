
import { Bot, Building2, Calendar, Ruler } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';

interface ProjectAIHeaderProps {
  project: Project;
}

export const ProjectAIHeader = ({ project }: ProjectAIHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-4 md:p-6 rounded-t-lg mb-4 md:mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="bg-white/20 p-2 md:p-3 rounded-full">
            <Bot className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold">IA MadenAI – {project.name}</h1>
            <p className="text-blue-100 mt-1 text-sm md:text-base">Assistente especializado treinado neste projeto</p>
          </div>
        </div>
        
        <div className="flex flex-col md:text-right">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-blue-100">
            {project.total_area && (
              <div className="flex items-center space-x-1">
                <Ruler className="h-4 w-4" />
                <span>{project.total_area}m²</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          
          <Badge className="mt-2 bg-green-500/20 text-green-100 border-green-400/30 w-fit">
            <Building2 className="h-3 w-3 mr-1" />
            {project.analysis_data ? 'Analisado' : 'Processando'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
