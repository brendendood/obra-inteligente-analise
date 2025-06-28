
export const useDefaultAvatar = () => {
  const getDefaultAvatar = (gender?: string) => {
    switch (gender) {
      case 'male':
        return 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face';
      case 'female':
        return 'https://images.unsplash.com/photo-1494790108755-2616c047c7e1?w=150&h=150&fit=crop&crop=face';
      default:
        return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
    }
  };

  const getAvatarFallback = (gender?: string) => {
    switch (gender) {
      case 'male':
        return 'M';
      case 'female':
        return 'F';
      default:
        return '?';
    }
  };

  return {
    getDefaultAvatar,
    getAvatarFallback
  };
};
