import React, { useEffect } from 'react';
import { replaceMedia, getMediaSlots } from '@/utils/mediaReplacer';

// Global component to expose media replacement functionality
// Add this to your main layout or app component for easy access
export const GlobalMediaReplacer: React.FC = () => {
  useEffect(() => {
    // Make replaceMedia available globally for easy testing/development
    (window as any).replaceMedia = replaceMedia;
    (window as any).getMediaSlots = getMediaSlots;
    
    // Log available slots for development
    console.log('Available media slots:', getMediaSlots());
    
    // Example usage logged to console
    console.log(`
🎬 Media Replacement Ready!

Available slots: ${getMediaSlots().join(', ')}

Usage examples:
- replaceMedia('media-hero-1', 'https://example.com/video.mp4', 'mp4')
- replaceMedia('media-how-1', 'https://example.com/demo.gif', 'gif')
- replaceMedia('media-results-1', 'https://example.com/results.webm', 'webm')

All slots support:
✓ MP4 videos (recommended for main demos)
✓ WebM videos (better compression) 
✓ GIF animations (for simple loops)

Options available:
- autoplay, loop, muted, controls, poster, alt
    `);
  }, []);

  return null; // This component doesn't render anything
};

export default GlobalMediaReplacer;