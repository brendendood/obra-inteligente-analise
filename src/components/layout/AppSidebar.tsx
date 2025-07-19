
import { useParams } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectContextHeader } from './sidebar/ProjectContextHeader';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { UserProfile } from './sidebar/UserProfile';

export const AppSidebar = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject } = useProject();
  const { open } = useSidebar();

  // Determinar se estamos numa área de projeto com verificação de segurança
  const isInProject = Boolean(projectId && currentProject && currentProject.id === projectId);

  return (
    <Sidebar 
      variant="inset" 
      className="border-r"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border/50 p-3">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md flex items-center justify-center flex-shrink-0">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          {open && (
            <span className="text-xl font-bold text-gray-800 truncate ml-3">MadenAI</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {/* Project Context Header - com verificação de segurança */}
        <ProjectContextHeader isInProject={isInProject} />

        {/* Navigation Menu */}
        <SidebarNavigation />
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-3">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};
