
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useDefaultAvatar } from '@/hooks/useDefaultAvatar';
import { cn } from '@/lib/utils';

interface UserProfileCardProps {
  isCollapsed: boolean;
  onClick?: () => void;
}

export const UserProfileCard = ({ isCollapsed, onClick }: UserProfileCardProps) => {
  const { user } = useAuth();
  const { getDefaultAvatarUrl, getAvatarFallback } = useDefaultAvatar();

  const userGender = user?.user_metadata?.gender;
  const avatarUrl = user?.user_metadata?.avatar_url || getDefaultAvatarUrl(userGender);

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div 
        className={cn(
          "flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          isCollapsed && "justify-center"
        )}
        onClick={onClick}
        title={isCollapsed ? user?.user_metadata?.full_name || 'Usuário' : undefined}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {getAvatarFallback(userGender)}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.user_metadata?.full_name || 'Usuário'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
