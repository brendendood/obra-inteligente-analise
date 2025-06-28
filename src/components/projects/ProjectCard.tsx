
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectCardHeader } from './ProjectCardHeader';
import { ProjectCardStatus } from './ProjectCardStatus';
import { ProjectCardActions } from './ProjectCardActions';
import { ProjectCardContent } from './ProjectCardContent';

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

  return (
    <Card 
      draggable={!isEditing}
      onDragStart={(e) => !isEditing && onDragStart(e, project)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, project)}
      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing group hover:scale-[1.02] animate-fade-in relative h-full"
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
      />
    </Card>
  );
};

export default ProjectCard;
