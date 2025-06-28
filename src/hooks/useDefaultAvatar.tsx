
export const useDefaultAvatar = () => {
  const getDefaultAvatar = (gender?: string) => {
    switch (gender) {
      case 'male':
        return 'https://api.dicebear.com/7.x/avataaars/svg?seed=male-engineer&backgroundColor=b6e3f4&clothingColor=3c4858&eyebrowType=default&eyeType=default&mouthType=smile&skinColor=light&topType=shortHairShortFlat&facialHairType=light';
      case 'female':
        return 'https://api.dicebear.com/7.x/avataaars/svg?seed=female-architect&backgroundColor=fde2e4&clothingColor=94a3b8&eyebrowType=default&eyeType=default&mouthType=smile&skinColor=light&topType=longHairStraight';
      default:
        return 'https://api.dicebear.com/7.x/bottts/svg?seed=construction-pro&backgroundColor=e0f2fe&colorful=true&mood=happy';
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
