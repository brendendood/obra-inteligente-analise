
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectCardHeader } from './ProjectCardHeader';
import { ProjectCardStatus } from './ProjectCardStatus';
import { ProjectCardActions } from './ProjectCardActions';
import { ProjectCardContent } from './ProjectCardContent';
import { ProjectEditDialog } from './ProjectEditDialog';

interface ProjectCardProps {
  project: any;
  onDragStart: (e: React.DragEvent, project: any) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, project: any) => void;
  onDelete: (project: any) => void;
  onEdit?: (project: any) => void;
  onUpdate?: (project: any) => void;
}

const ProjectCard = ({ 
  project, 
  onDragStart, 
  onDragEnd, 
  onDragOver, 
  onDrop, 
  onDelete,
  onEdit,
  onUpdate 
}: ProjectCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Card 
      draggable={!isEditing}
      onDragStart={(e) => !isEditing && onDragStart(e, project)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, project)}
      className="border border-border bg-card hover:bg-accent/30 transition-all duration-200 cursor-grab active:cursor-grabbing group hover:scale-[1.01] animate-fade-in relative h-full rounded-apple shadow-sm hover:shadow-md"
    >
      <ProjectCardHeader 
        project={project}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onUpdate={onUpdate}
      />
      
      <div className="px-6 pb-3">
        <ProjectCardStatus project={project} />
      </div>
      
      <ProjectCardContent project={project} />
      
      <ProjectCardActions 
        project={project}
        onDelete={onDelete}
        onEdit={() => setIsEditing(true)}
        onEditComplete={() => setIsEditDialogOpen(true)}
      />

      {/* Dialog de Edição Completa */}
      <ProjectEditDialog
        project={project}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={(updatedProject) => {
          onUpdate?.(updatedProject);
          setIsEditDialogOpen(false);
        }}
      />
    </Card>
  );
};

export default ProjectCard;
