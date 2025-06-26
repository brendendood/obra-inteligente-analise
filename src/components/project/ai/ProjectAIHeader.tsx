
import { Bot, Building2, Calendar, Ruler } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';

interface ProjectAIHeaderProps {
  project: Project;
}

export const ProjectAIHeader = ({ project }: ProjectAIHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-3 md:p-4 rounded-t-lg mb-2 md:mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-base md:text-xl font-bold">IA MadenAI – {project.name}</h1>
            <p className="text-blue-100 mt-1 text-xs md:text-sm">Assistente especializado treinado neste projeto</p>
          </div>
        </div>
        
        <div className="flex flex-col md:text-right">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-blue-100">
            {project.total_area && (
              <div className="flex items-center space-x-1">
                <Ruler className="h-3 w-3 md:h-4 md:w-4" />
                <span>{project.total_area}m²</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          
          <Badge className="mt-2 bg-green-500/20 text-green-100 border-green-400/30 w-fit text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            {project.analysis_data ? 'Analisado' : 'Processando'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
