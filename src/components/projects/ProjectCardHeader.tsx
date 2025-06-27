
import { useState } from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Save, X, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectCardHeaderProps {
  project: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onUpdate?: (project: any) => void;
}

export const ProjectCardHeader = ({ 
  project, 
  isEditing, 
  setIsEditing, 
  onUpdate 
}: ProjectCardHeaderProps) => {
  const { toast } = useToast();
  const [editedName, setEditedName] = useState(project.name);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveName = async () => {
    if (!editedName.trim() || editedName === project.name) {
      setIsEditing(false);
      setEditedName(project.name);
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ name: editedName.trim() })
        .eq('id', project.id);

      if (error) throw error;

      const updatedProject = { ...project, name: editedName.trim() };
      onUpdate?.(updatedProject);

      toast({
        title: "✅ Nome atualizado!",
        description: "O nome do projeto foi alterado com sucesso.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      toast({
        title: "❌ Erro ao atualizar",
        description: "Não foi possível alterar o nome do projeto.",
        variant: "destructive",
      });
      setEditedName(project.name);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(project.name);
  };

  return (
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          <GripVertical className="h-5 w-5 text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="text-sm font-medium"
                  autoFocus
                  disabled={isUpdating}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveName}
                  disabled={isUpdating}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 mb-2">
                <CardTitle className="text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 flex-1">
                  {project.name}
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar nome do projeto</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
