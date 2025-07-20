
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

export const SidebarMenuItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  isCollapsed, 
  onClick 
}: SidebarMenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
        isActive
          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
        isCollapsed && "justify-center"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={cn(
        "h-5 w-5 flex-shrink-0 transition-colors",
        !isCollapsed && "mr-3",
        isActive 
          ? "text-blue-600 dark:text-blue-400" 
          : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
      )} />
      {!isCollapsed && (
        <span className="truncate">{label}</span>
      )}
    </button>
  );
};
