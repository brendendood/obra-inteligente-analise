
export const useDefaultAvatar = () => {
  // Generate initials from full name
  const getInitials = (fullName: string): string => {
    if (!fullName || fullName.trim() === '') return '??';
    
    const names = fullName.trim().split(' ').filter(name => name.length > 0);
    
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    const firstName = names[0].charAt(0).toUpperCase();
    const lastName = names[names.length - 1].charAt(0).toUpperCase();
    return `${firstName}${lastName}`;
  };

  // Generate professional initials avatar as SVG
  const generateInitialsAvatar = (initials: string) => {
    const colors = [
      '#1e40af', // blue-800
      '#7c3aed', // violet-600
      '#059669', // emerald-600
      '#dc2626', // red-600
      '#d97706', // amber-600
      '#4338ca', // indigo-700
      '#be185d', // pink-700
      '#0891b2', // cyan-600
    ];
    
    // Use initials to pick consistent color
    const colorIndex = initials.charCodeAt(0) % colors.length;
    const backgroundColor = colors[colorIndex];
    
    const svg = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="${backgroundColor}"/>
        <text x="50" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="600" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
      </svg>
    `)}`;
    
    return svg;
  };

  // Get avatar URL for a user (always initials)
  const getAvatarUrl = (fullName: string, email?: string) => {
    const displayName = fullName || email || '';
    const initials = getInitials(displayName);
    return generateInitialsAvatar(initials);
  };

  // Legacy function for backward compatibility
  const getDefaultAvatar = (fullName?: string) => {
    const initials = getInitials(fullName || '');
    return initials;
  };

  const getAvatarFallback = (fullName?: string) => {
    const initials = getInitials(fullName || '');
    return initials;
  };

  return {
    getInitials,
    generateInitialsAvatar,
    getAvatarUrl,
    getDefaultAvatar,
    getAvatarFallback
  };
};
