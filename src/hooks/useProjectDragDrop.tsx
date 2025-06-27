
import { useState, useCallback } from 'react';
import { Project } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

interface DragDropState {
  draggedProject: Project | null;
  dragOverIndex: number | null;
  isDragging: boolean;
}

export const useProjectDragDrop = (
  projects: Project[],
  onReorder: (reorderedProjects: Project[]) => void
) => {
  const [dragState, setDragState] = useState<DragDropState>({
    draggedProject: null,
    dragOverIndex: null,
    isDragging: false
  });
  const { toast } = useToast();

  const handleDragStart = useCallback((e: React.DragEvent, project: Project) => {
    console.log('🎯 DRAG: Iniciando drag para projeto:', project.name);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', project.id);
    
    setDragState({
      draggedProject: project,
      dragOverIndex: null,
      isDragging: true
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    setDragState(prev => ({
      ...prev,
      dragOverIndex: index
    }));
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      dragOverIndex: null
    }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    console.log('📍 DRAG: Drop no índice:', dropIndex);
    
    const { draggedProject } = dragState;
    if (!draggedProject) return;

    const draggedIndex = projects.findIndex(p => p.id === draggedProject.id);
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDragState({
        draggedProject: null,
        dragOverIndex: null,
        isDragging: false
      });
      return;
    }

    // Criar nova ordem dos projetos
    const newProjects = [...projects];
    const [removed] = newProjects.splice(draggedIndex, 1);
    newProjects.splice(dropIndex, 0, removed);

    console.log('✅ DRAG: Nova ordem:', newProjects.map(p => p.name));
    
    onReorder(newProjects);
    
    setDragState({
      draggedProject: null,
      dragOverIndex: null,
      isDragging: false
    });

    toast({
      title: "✅ Ordem atualizada",
      description: `Projeto "${draggedProject.name}" reposicionado com sucesso.`,
      duration: 2000
    });
  }, [dragState, projects, onReorder, toast]);

  const handleDragEnd = useCallback(() => {
    console.log('🏁 DRAG: Finalizando drag');
    setDragState({
      draggedProject: null,
      dragOverIndex: null,
      isDragging: false
    });
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  };
};
