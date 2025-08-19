import React from 'react';
import { Play, FileVideo } from 'lucide-react';

interface MediaPlaceholderProps {
  slotId: string;
  title: string;
  description?: string;
  dimensions?: string;
  className?: string;
}

export const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
  slotId,
  title,
  description = "Área reservada para vídeo/GIF",
  dimensions = "Responsivo",
  className = ""
}) => {
  return (
    <div 
      className={`relative bg-muted/30 border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:bg-muted/40 ${className}`}
      data-slot={slotId}
      data-media-placeholder="true"
    >
      <div className="space-y-4">
        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <FileVideo className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
            <Play className="h-3 w-3" />
            Slot ID: {slotId}
          </div>
          <p className="text-xs text-muted-foreground">
            Formatos: MP4, WebM, GIF • {dimensions}
          </p>
        </div>
      </div>
      
      {/* Helper comment for developers */}
      {/*
        Para substituir esta mídia:
        1. Use: replaceMedia('${slotId}', 'sua-url-aqui', 'mp4|webm|gif')
        2. Ou substitua diretamente o elemento com data-slot="${slotId}"
        3. Dimensões recomendadas variam por seção - consulte documentação
      */}
    </div>
  );
};