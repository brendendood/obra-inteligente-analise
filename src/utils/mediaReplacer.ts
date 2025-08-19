/**
 * Utility function to replace media placeholders with actual content
 * @param slotId - The unique identifier of the media slot (e.g., 'media-hero-1')
 * @param url - The URL of the media file (MP4, WebM, GIF)
 * @param type - The type of media ('mp4', 'webm', 'gif')
 * @param options - Additional options for the media element
 */
export const replaceMedia = (
  slotId: string, 
  url: string, 
  type: 'mp4' | 'webm' | 'gif',
  options: {
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
    poster?: string;
    alt?: string;
  } = {}
) => {
  const placeholder = document.querySelector(`[data-slot="${slotId}"]`);
  
  if (!placeholder) {
    console.warn(`Media placeholder with slot ID "${slotId}" not found`);
    return false;
  }

  let mediaElement: HTMLElement;

  if (type === 'gif') {
    // For GIFs, use img element
    mediaElement = document.createElement('img');
    (mediaElement as HTMLImageElement).src = url;
    (mediaElement as HTMLImageElement).alt = options.alt || `Media content for ${slotId}`;
    mediaElement.className = 'w-full h-full object-cover rounded-lg';
  } else {
    // For videos (MP4, WebM), use video element
    mediaElement = document.createElement('video');
    const videoEl = mediaElement as HTMLVideoElement;
    
    videoEl.src = url;
    videoEl.autoplay = options.autoplay ?? true;
    videoEl.loop = options.loop ?? true;
    videoEl.muted = options.muted ?? true;
    videoEl.controls = options.controls ?? false;
    videoEl.playsInline = true;
    
    if (options.poster) {
      videoEl.poster = options.poster;
    }
    
    videoEl.className = 'w-full h-full object-cover rounded-lg';
    
    // Add loading and error handling
    videoEl.addEventListener('loadstart', () => {
      console.log(`Loading media for slot ${slotId}`);
    });
    
    videoEl.addEventListener('error', (e) => {
      console.error(`Error loading media for slot ${slotId}:`, e);
    });
  }

  // Replace the placeholder content
  placeholder.innerHTML = '';
  placeholder.appendChild(mediaElement);
  placeholder.classList.remove('border-dashed', 'bg-muted/30');
  placeholder.classList.add('overflow-hidden');

  console.log(`Successfully replaced media for slot "${slotId}" with ${type.toUpperCase()}`);
  return true;
};

/**
 * Get all available media slots
 */
export const getMediaSlots = (): string[] => {
  const placeholders = document.querySelectorAll('[data-slot]');
  return Array.from(placeholders).map(el => el.getAttribute('data-slot') || '');
};

/**
 * Reset a media slot back to placeholder state
 */
export const resetMediaSlot = (slotId: string) => {
  const element = document.querySelector(`[data-slot="${slotId}"]`);
  if (element) {
    // This would need the original placeholder content
    // For now, just log - implementation depends on how you want to handle resets
    console.log(`Reset functionality for slot ${slotId} - implement based on needs`);
  }
};