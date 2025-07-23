
export const useDefaultAvatar = () => {
  const getDefaultAvatar = (gender?: string) => {
    switch (gender) {
      case 'male':
        return '👨‍💼'; // Emoji masculino profissional
      case 'female':
        return '👩‍💼'; // Emoji feminino profissional  
      default:
        return '😊'; // Emoji de rosto feliz (padrão)
    }
  };

  const getAvatarFallback = (gender?: string) => {
    switch (gender) {
      case 'male':
        return '👨‍💼';
      case 'female':
        return '👩‍💼';
      default:
        return '😊';
    }
  };

  // Função para renderizar emoji como imagem SVG
  const getEmojiAsSvg = (emoji: string) => {
    const svg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="70" font-size="70" text-anchor="middle" x="50">${emoji}</text></svg>`;
    return svg;
  };

  const getDefaultAvatarUrl = (gender?: string) => {
    const emoji = getDefaultAvatar(gender);
    return getEmojiAsSvg(emoji);
  };

  return {
    getDefaultAvatar,
    getAvatarFallback,
    getDefaultAvatarUrl,
    getEmojiAsSvg
  };
};
