
import { useParams } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectContextHeader } from './sidebar/ProjectContextHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { UserProfile } from './sidebar/UserProfile';

export const AppSidebar = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();

  // Determinar se estamos numa área de projeto com verificação de segurança
  const isInProject = Boolean(projectId && currentProject && currentProject.id === projectId);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b border-gray-100 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-gray-800">MadenAI</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Project Context Header - com verificação de segurança */}
        <ProjectContextHeader isInProject={isInProject} />

        {/* Navigation Menu */}
        <SidebarNavigation />
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-4">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};
