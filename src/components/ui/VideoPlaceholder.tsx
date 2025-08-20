import React from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlaceholderProps {
  title: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showControls?: boolean;
}

const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({
  title,
  description,
  className,
  size = 'md',
  showControls = true
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const sizeClasses = {
    sm: 'h-48 md:h-56',
    md: 'h-64 md:h-72', 
    lg: 'h-80 md:h-96',
    xl: 'h-96 md:h-[28rem]'
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={cn(
      "relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 group transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50",
      "rounded-2xl", // Apple-style rounded corners
      sizeClasses[size],
      className
    )}>
      {/* Video thumbnail/background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-slate-50" />
      
      {/* Overlay with subtle pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content overlay */}
      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
        {/* Play button */}
        {showControls && (
          <button
            onClick={togglePlay}
            className="mb-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-slate-900/10 hover:bg-white hover:scale-110 transition-all duration-300 group-hover:shadow-xl"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-primary ml-0.5" />
            ) : (
              <Play className="w-7 h-7 text-primary ml-1" />
            )}
          </button>
        )}

        {/* Title */}
        <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 font-display">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm md:text-base text-slate-600 max-w-xs leading-relaxed">
            {description}
          </p>
        )}

        {/* Progress indicator when playing */}
        {isPlaying && (
          <div className="mt-4 w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '45%' }} />
          </div>
        )}
      </div>

      {/* Apple-style subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    </div>
  );
};

export default VideoPlaceholder;